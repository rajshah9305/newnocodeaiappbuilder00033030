import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'updatedAt';
    const order = searchParams.get('order') || 'desc';

    // Build where clause
    const where: any = { userId: user.id };
    
    if (filter !== 'all') {
      where.status = filter;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Fetch projects with pagination
    const projects = await prisma.project.findMany({
      where,
      orderBy: { [sort]: order },
      include: {
        _count: {
          select: { agents: true }
        },
        analytics: true
      },
      take: 50 // Limit results
    });

    // Update analytics
    await prisma.userAnalytics.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'deployed').length
      },
      update: {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'deployed').length
      }
    });

    return NextResponse.json({
      projects: projects.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        framework: project.framework,
        category: project.category,
        deployUrl: project.deployUrl,
        thumbnail: project.thumbnail,
        views: project.analytics?.views || 0,
        lastModified: project.updatedAt.toISOString(),
        createdAt: project.createdAt.toISOString()
      }))
    });

  } catch (error) {
    console.error('Projects fetch error:', error);
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { name, description, prompt, framework, category } = await request.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        prompt: prompt || '',
        framework: framework || 'react',
        category: category || 'web',
        status: 'draft',
        userId: user.id
      }
    });

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
    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}