import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Cerebras } from 'cerebras';
import { generateCodeWithCrew } from '@/lib/crewai';

// Agent configuration for multi-agent orchestration
const AGENTS = [
  {
    id: 'orchestrator',
    name: 'Project Orchestrator',
    role: 'Senior Project Manager',
    goal: 'Analyze requirements and create detailed project blueprint',
    backstory: 'Expert in software architecture and project planning with 10+ years experience',
    tools: [],
    max_execution_time: 300
  },
  {
    id: 'ui',
    name: 'UI/UX Designer',
    role: 'Senior Frontend Developer',
    goal: 'Create beautiful, responsive user interfaces with modern design principles',
    backstory: 'Creative frontend developer specializing in React and modern CSS frameworks',
    tools: ['react_component_generator', 'tailwind_styler'],
    max_execution_time: 600
  },
  {
    id: 'backend',
    name: 'Backend Architect',
    role: 'Senior Backend Engineer',
    goal: 'Design and implement robust API endpoints and business logic',
    backstory: 'Experienced backend developer with expertise in Node.js, databases, and API design',
    tools: ['api_generator', 'database_schema_designer'],
    max_execution_time: 600
  },
  {
    id: 'database',
    name: 'Database Engineer',
    role: 'Database Specialist',
    goal: 'Design optimal database schemas and data relationships',
    backstory: 'Database expert with deep knowledge of PostgreSQL, MongoDB, and data modeling',
    tools: ['schema_generator', 'migration_writer'],
    max_execution_time: 300
  },
  {
    id: 'tester',
    name: 'Quality Assurance',
    role: 'QA Engineer',
    goal: 'Ensure code quality, write tests, and validate functionality',
    backstory: 'Quality assurance specialist focused on automated testing and code quality',
    tools: ['test_generator', 'code_analyzer'],
    max_execution_time: 300
  },
  {
    id: 'deployment',
    name: 'DevOps Specialist',
    role: 'DevOps Engineer',
    goal: 'Prepare production-ready deployment configuration',
    backstory: 'DevOps expert specializing in modern deployment pipelines and infrastructure',
    tools: ['deployment_config_generator', 'docker_composer'],
    max_execution_time: 200
  }
];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt } = await request.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Get user's Cerebras API key
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { apiKeys: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cerebrasKey = user.apiKeys.find(key => key.service === 'cerebras');
    if (!cerebrasKey) {
      return NextResponse.json({ 
        error: 'Cerebras API key required. Please add one in Settings.' 
      }, { status: 400 });
    }

    // Create project record
    const project = await prisma.project.create({
      data: {
        name: extractProjectName(prompt),
        description: prompt.substring(0, 200),
        prompt,
        status: 'building',
        userId: user.id,
        framework: 'react',
        category: 'web'
      }
    });

    // Initialize Cerebras client
    const cerebras = new Cerebras({
      apiKey: process.env.CEREBRAS_API_KEY || cerebrasKey.keyHash // Use fallback for demo
    });

    // Create response stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Process each agent sequentially
          for (const agent of AGENTS) {
            // Send agent start event
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({
                type: 'agent_start',
                agentId: agent.id,
                agentName: agent.name,
                timestamp: new Date().toISOString()
              })}\n\n`)
            );

            // Create agent execution record
            const agentExecution = await prisma.agentExecution.create({
              data: {
                projectId: project.id,
                agentId: agent.id,
                agentName: agent.name,
                status: 'active',
                progress: 0
              }
            });

            try {
              // Generate code using Cerebras + CrewAI
              const agentResult = await generateAgentCode(cerebras, agent, prompt, project.id);
              
              // Stream progress updates
              for (const line of agentResult.output.split('\n')) {
                if (line.trim()) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({
                      type: 'agent_progress',
                      agentId: agent.id,
                      content: line,
                      timestamp: new Date().toISOString()
                    })}\n\n`)
                  );
                  // Small delay for visual effect
                  await new Promise(resolve => setTimeout(resolve, 50));
                }
              }

              // Save generated code
              if (agentResult.code) {
                await prisma.codeFile.create({
                  data: {
                    projectId: project.id,
                    filename: agentResult.filename,
                    content: agentResult.code,
                    language: agentResult.language,
                    agent: agent.id
                  }
                });
              }

              // Update agent execution status
              await prisma.agentExecution.update({
                where: { id: agentExecution.id },
                data: {
                  status: 'completed',
                  progress: 100,
                  output: agentResult.output,
                  completedAt: new Date(),
                  duration: Math.floor((Date.now() - agentExecution.startedAt.getTime()) / 1000)
                }
              });

              // Send agent completion event
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({
                  type: 'agent_complete',
                  agentId: agent.id,
                  code: agentResult.code,
                  timestamp: new Date().toISOString()
                })}\n\n`)
              );

            } catch (agentError) {
              console.error(`Agent ${agent.id} error:`, agentError);
              
              // Update agent with error status
              await prisma.agentExecution.update({
                where: { id: agentExecution.id },
                data: {
                  status: 'error',
                  error: agentError instanceof Error ? agentError.message : 'Unknown error',
                  completedAt: new Date()
                }
              });

              // Continue with next agent even if one fails
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({
                  type: 'agent_error',
                  agentId: agent.id,
                  error: agentError instanceof Error ? agentError.message : 'Unknown error',
                  timestamp: new Date().toISOString()
                })}\n\n`)
              );
            }
          }

          // Update project status
          await prisma.project.update({
            where: { id: project.id },
            data: { 
              status: 'deployed',
              deployUrl: `https://demo-${project.id}.vercel.app` // Mock URL
            }
          });

          // Send completion event
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({
              type: 'generation_complete',
              projectId: project.id,
              timestamp: new Date().toISOString()
            })}\n\n`)
          );

          controller.close();
        } catch (error) {
          console.error('Generation error:', error);
          
          // Update project status to error
          await prisma.project.update({
            where: { id: project.id },
            data: { status: 'error' }
          });

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({
              type: 'generation_error',
              error: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date().toISOString()
            })}\n\n`)
          );
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateAgentCode(
  cerebras: Cerebras,
  agent: any,
  prompt: string,
  projectId: string
) {
  const systemPrompt = `You are ${agent.name}, a ${agent.role}.
  
Goal: ${agent.goal}
Background: ${agent.backstory}

You are part of a multi-agent team building a web application. Generate production-ready code for your specific role.

Guidelines:
- Generate complete, functional code without TODOs or placeholders
- Use modern best practices and patterns
- Follow TypeScript and React best practices
- Include proper error handling
- Write clean, documented code
- Ensure code is production-ready

User Request: ${prompt}

Focus on your specific expertise area and generate the appropriate code files.`;

  const completion = await cerebras.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    model: 'llama-3.1-8b-instruct',
    max_completion_tokens: 4000,
    temperature: 0.7,
    stream: false
  });

  const response = completion.choices[0].message.content || '';
  
  // Extract code and metadata from response
  const codeMatch = response.match(/```(\w+)?\n([\s\S]*?)```/);
  const code = codeMatch ? codeMatch[2] : '';
  const language = codeMatch ? (codeMatch[1] || 'javascript') : 'javascript';
  
  // Generate appropriate filename based on agent role
  const filename = generateFilename(agent.id, language);

  return {
    output: response,
    code,
    language,
    filename
  };
}

function extractProjectName(prompt: string): string {
  // Extract project name from prompt using simple heuristics
  const nameMatch = prompt.match(/(?:create|build|make)\s+(?:a|an)?\s*(.+?)(?:\s+(?:app|application|website|platform|system))/i);
  if (nameMatch) {
    return nameMatch[1].trim().split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  // Fallback to generic name with timestamp
  return `Generated App ${Date.now()}`;
}

function generateFilename(agentId: string, language: string): string {
  const extensions = {
    javascript: '.js',
    typescript: '.ts',
    jsx: '.jsx',
    tsx: '.tsx',
    css: '.css',
    html: '.html',
    sql: '.sql',
    json: '.json'
  };

  const extension = extensions[language as keyof typeof extensions] || '.js';

  const filenames = {
    orchestrator: `project-config${extension}`,
    ui: `components/App${extension.includes('ts') ? '.tsx' : '.jsx'}`,
    backend: `api/routes${extension}`,
    database: `schema/database.sql`,
    tester: `tests/app.test${extension}`,
    deployment: 'vercel.json'
  };

  return filenames[agentId as keyof typeof filenames] || `${agentId}${extension}`;
}