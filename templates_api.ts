import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Mock templates data for demo purposes
const MOCK_TEMPLATES = [
  {
    id: 'template-1',
    name: 'SaaS Dashboard',
    category: 'Business',
    description: 'Complete dashboard template for SaaS applications with user authentication, analytics, and team management',
    image: '📊',
    downloads: 2341,
    rating: 4.8,
    premium: true,
    price: '$49',
    features: ['User Authentication', 'Analytics Dashboard', 'Team Management', 'API Integration', 'Responsive Design'],
    framework: 'React',
    codeFiles: [
      {
        filename: 'components/Dashboard.tsx',
        content: `import React from 'react';
import { BarChart3, Users, DollarSign, Activity } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value="$45,231.89"
            change="+20.1% from last month"
            icon={DollarSign}
          />
          <StatCard
            title="Active Users"
            value="2,350"
            change="+15% from last month"
            icon={Users}
          />
          <StatCard
            title="Conversion Rate"
            value="3.24%"
            change="+2.5% from last month"
            icon={Activity}
          />
          <StatCard
            title="Total Orders"
            value="1,429"
            change="+8.2% from last month"
            icon={BarChart3}
          />
        </div>
        
        {/* Charts and Tables would go here */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-600">Your analytics and recent activity will appear here.</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-green-600">{change}</p>
        </div>
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
    </div>
  );
}`,
        language: 'tsx',
        agent: 'ui'
      }
    ]
  },
  {
    id: 'template-2',
    name: 'E-commerce Store',
    category: 'E-commerce',
    description: 'Full-featured online store with product catalog, shopping cart, and payment integration',
    image: '🛒',
    downloads: 1876,
    rating: 4.7,
    premium: false,
    price: 'Free',
    features: ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Management', 'Customer Reviews'],
    framework: 'Next.js',
    codeFiles: []
  },
  {
    id: 'template-3',
    name: 'Portfolio Website',
    category: 'Portfolio',
    description: 'Clean portfolio template for developers and designers',
    image: '💼',
    downloads: 987,
    rating: 4.9,
    premium: false,
    price: 'Free',
    features: ['Project Gallery', 'Contact Form', 'SEO Optimized', 'Blog Section', 'Dark Mode'],
    framework: 'React'
  },
  {
    id: 'template-4',
    name: 'Task Management App',
    category: 'Productivity',
    description: 'Comprehensive task management application with team collaboration features',
    image: '✅',
    downloads: 1543,
    rating: 4.6,
    premium: true,
    price: '$29',
    features: ['Task Boards', 'Team Collaboration', 'Time Tracking', 'Reports', 'Mobile Responsive'],
    framework: 'React'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'downloads';

    // Filter templates
    let templates = MOCK_TEMPLATES;

    if (category !== 'all') {
      templates = templates.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      templates = templates.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort templates
    templates.sort((a, b) => {
      switch (sort) {
        case 'downloads':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return b.downloads - a.downloads;
      }
    });

    // Get unique categories
    const categories = ['all', ...new Set(MOCK_TEMPLATES.map(t => t.category))];

    return NextResponse.json({
      templates,
      categories,
      total: templates.length
    });

  } catch (error) {
    console.error('Templates fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { templateId, projectName, projectDescription } = await request.json();

    if (!templateId || !projectName) {
      return NextResponse.json(
        { error: 'Template ID and project name are required' },
        { status: 400 }
      );
    }

    // Find template
    const template = MOCK_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create project from template
    const project = await prisma.project.create({
      data: {
        name: projectName,
        description: projectDescription || template.description,
        prompt: `Create a ${template.name} based on the template`,
        framework: template.framework.toLowerCase(),
        category: template.category.toLowerCase(),
        status: 'draft',
        userId: user.id,
        thumbnail: template.image
      }
    });

    // If template has code files, create them
    if (template.codeFiles) {
      for (const file of template.codeFiles) {
        await prisma.codeFile.create({
          data: {
            projectId: project.id,
            filename: file.filename,
            content: file.content,
            language: file.language,
            agent: file.agent
          }
        });
      }
    }

    // Increment download count (in real implementation)
    // await prisma.template.update({
    //   where: { id: templateId },
    //   data: { downloads: { increment: 1 } }
    // });

    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        framework: project.framework,
        category: project.category,
        createdAt: project.createdAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Template use error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}