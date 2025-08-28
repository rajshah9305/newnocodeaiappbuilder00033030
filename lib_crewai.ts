import { Cerebras } from 'cerebras';

export interface Agent {
  id: string;
  name: string;
  role: string;
  goal: string;
  backstory: string;
  tools: string[];
  max_execution_time: number;
}

export interface CrewResult {
  success: boolean;
  output: string;
  code?: string;
  filename?: string;
  language?: string;
  error?: string;
}

export class CrewAI {
  private cerebras: Cerebras;

  constructor(apiKey: string) {
    this.cerebras = new Cerebras({ apiKey });
  }

  async executeAgent(agent: Agent, prompt: string, context?: any): Promise<CrewResult> {
    try {
      const systemPrompt = this.buildSystemPrompt(agent, context);
      const userPrompt = this.buildUserPrompt(agent, prompt);

      const completion = await this.cerebras.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: 'llama-3.1-8b-instruct',
        max_completion_tokens: 4000,
        temperature: 0.7,
        stream: false
      });

      const response = completion.choices[0].message.content || '';
      
      // Parse the response to extract code and metadata
      const parsedResult = this.parseAgentResponse(agent, response);

      return {
        success: true,
        output: response,
        ...parsedResult
      };

    } catch (error) {
      console.error(`Agent ${agent.id} execution error:`, error);
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private buildSystemPrompt(agent: Agent, context?: any): string {
    let systemPrompt = `You are ${agent.name}, a ${agent.role}.

ROLE: ${agent.role}
GOAL: ${agent.goal}
BACKSTORY: ${agent.backstory}

You are part of a collaborative AI team building web applications. Your specific expertise is crucial for the project's success.

GUIDELINES:
- Generate complete, production-ready code without TODOs or placeholders
- Follow modern development best practices
- Use TypeScript and React when applicable
- Include proper error handling and validation
- Write clean, well-documented code
- Ensure code is immediately deployable
- Focus on your specific area of expertise

OUTPUT FORMAT:
Please provide your response in the following format:
1. Brief explanation of your approach
2. Complete code implementation
3. Any additional notes or recommendations

Wrap all code in appropriate code blocks with language specification.`;

    if (context) {
      systemPrompt += `\n\nCONTEXT: ${JSON.stringify(context, null, 2)}`;
    }

    return systemPrompt;
  }

  private buildUserPrompt(agent: Agent, prompt: string): string {
    const roleSpecificPrompts = {
      orchestrator: `Analyze the following project requirements and create a comprehensive project structure and configuration:

${prompt}

Please provide:
1. Project architecture overview
2. Technology stack recommendations
3. File structure
4. Configuration files (package.json, etc.)
5. Development workflow recommendations`,

      ui: `Create a beautiful, modern React component for the following requirement:

${prompt}

Please provide:
1. Complete React component with TypeScript
2. Tailwind CSS styling (modern, responsive design)
3. Proper component structure and props
4. Accessibility considerations
5. Mobile-responsive design`,

      backend: `Design and implement the backend API for the following requirement:

${prompt}

Please provide:
1. Complete API endpoints with TypeScript
2. Request/response interfaces
3. Error handling
4. Input validation
5. Database integration code`,

      database: `Design the database schema for the following requirement:

${prompt}

Please provide:
1. Database schema (SQL or Prisma)
2. Relationships and indexes
3. Data migration scripts
4. Seed data examples
5. Query optimization recommendations`,

      tester: `Create comprehensive tests for the following requirement:

${prompt}

Please provide:
1. Unit tests
2. Integration tests
3. Test utilities and helpers
4. Mock data and fixtures
5. Testing best practices`,

      deployment: `Create deployment configuration for the following requirement:

${prompt}

Please provide:
1. Deployment configuration files
2. Environment setup
3. CI/CD pipeline configuration
4. Docker configuration (if needed)
5. Monitoring and logging setup`
    };

    return roleSpecificPrompts[agent.id as keyof typeof roleSpecificPrompts] || prompt;
  }

  private parseAgentResponse(agent: Agent, response: string): Partial<CrewResult> {
    // Extract code blocks from the response
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const codeBlocks = [];
    let match;

    while ((match = codeBlockRegex.exec(response)) !== null) {
      codeBlocks.push({
        language: match[1] || 'javascript',
        code: match[2].trim()
      });
    }

    if (codeBlocks.length === 0) {
      return {};
    }

    // Use the first (usually main) code block
    const mainCodeBlock = codeBlocks[0];
    
    return {
      code: mainCodeBlock.code,
      language: mainCodeBlock.language,
      filename: this.generateFilename(agent.id, mainCodeBlock.language)
    };
  }

  private generateFilename(agentId: string, language: string): string {
    const extensions: Record<string, string> = {
      javascript: '.js',
      typescript: '.ts',
      jsx: '.jsx',
      tsx: '.tsx',
      css: '.css',
      scss: '.scss',
      html: '.html',
      sql: '.sql',
      json: '.json',
      yaml: '.yml',
      dockerfile: 'Dockerfile',
      prisma: '.prisma'
    };

    const extension = extensions[language.toLowerCase()] || '.js';

    const filenames: Record<string, string> = {
      orchestrator: `project.config${extension === '.js' ? '.json' : extension}`,
      ui: `components/App${extension.includes('ts') ? '.tsx' : '.jsx'}`,
      backend: `pages/api/app${extension}`,
      database: language === 'sql' ? 'schema.sql' : `prisma/schema.prisma`,
      tester: `__tests__/app.test${extension}`,
      deployment: language === 'json' ? 'vercel.json' : `deploy${extension}`
    };

    return filenames[agentId] || `${agentId}-output${extension}`;
  }
}

export async function generateCodeWithCrew(
  apiKey: string,
  agents: Agent[],
  prompt: string
): Promise<Record<string, CrewResult>> {
  const crew = new CrewAI(apiKey);
  const results: Record<string, CrewResult> = {};
  
  for (const agent of agents) {
    const result = await crew.executeAgent(agent, prompt);
    results[agent.id] = result;
  }
  
  return results;
}