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

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '7d';

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        projects: {
          include: {
            analytics: true,
            _count: {
              select: { agents: true, codeFiles: true }
            }
          }
        },
        analytics: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate date range
    const now = new Date();
    const daysBack = timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 7;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    // Aggregate project analytics
    const totalProjects = user.projects.length;
    const activeProjects = user.projects.filter(p => p.status === 'deployed').length;
    const totalViews = user.projects.reduce((sum, p) => sum + (p.analytics?.views || 0), 0);
    const totalDeployments = user.projects.filter(p => p.deployUrl).length;

    // Generate chart data (mock data for demonstration)
    const chartData = generateChartData(daysBack);
    
    // Recent activity
    const recentActivity = user.projects
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5)
      .map(project => ({
        id: project.id,
        type: getActivityType(project.status),
        message: getActivityMessage(project.name, project.status),
        timestamp: project.updatedAt.toISOString(),
        project: project.name
      }));

    // Top projects by views
    const topProjects = user.projects
      .sort((a, b) => (b.analytics?.views || 0) - (a.analytics?.views || 0))
      .slice(0, 5)
      .map(project => ({
        id: project.id,
        name: project.name,
        views: project.analytics?.views || 0,
        status: project.status,
        framework: project.framework
      }));

    // Performance metrics
    const performanceMetrics = {
      averageBuildTime: calculateAverageBuildTime(user.projects),
      successRate: calculateSuccessRate(user.projects),
      popularFramework: getPopularFramework(user.projects)
    };

    // Update user analytics
    await prisma.userAnalytics.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        totalProjects,
        activeProjects,
        totalViews,
        totalDownloads: 0 // Not implemented yet
      },
      update: {
        totalProjects,
        activeProjects,
        totalViews
      }
    });

    return NextResponse.json({
      overview: {
        totalProjects,
        activeProjects,
        totalViews,
        totalDeployments,
        growthRate: calculateGrowthRate(user.projects, daysBack)
      },
      chartData,
      recentActivity,
      topProjects,
      performanceMetrics,
      timeRange
    });

  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function generateChartData(days: number) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      projects: Math.floor(Math.random() * 5) + 1,
      views: Math.floor(Math.random() * 100) + 50,
      deployments: Math.floor(Math.random() * 3) + 1
    });
  }
  return data;
}

function getActivityType(status: string): string {
  switch (status) {
    case 'deployed': return 'deployment';
    case 'building': return 'building';
    case 'error': return 'error';
    default: return 'created';
  }
}

function getActivityMessage(projectName: string, status: string): string {
  switch (status) {
    case 'deployed':
      return `${projectName} was successfully deployed`;
    case 'building':
      return `${projectName} is currently building`;
    case 'error':
      return `${projectName} encountered an error`;
    default:
      return `${projectName} was created`;
  }
}

function calculateAverageBuildTime(projects: any[]): number {
  const completedProjects = projects.filter(p => p.status === 'deployed' || p.status === 'error');
  if (completedProjects.length === 0) return 0;
  
  // Mock calculation - in real app, would use actual build times
  return Math.floor(Math.random() * 120) + 30; // 30-150 seconds
}

function calculateSuccessRate(projects: any[]): number {
  const totalAttempts = projects.length;
  const successful = projects.filter(p => p.status === 'deployed').length;
  
  return totalAttempts > 0 ? Math.round((successful / totalAttempts) * 100) : 0;
}

function getPopularFramework(projects: any[]): string {
  const frameworkCounts: Record<string, number> = {};
  
  projects.forEach(project => {
    frameworkCounts[project.framework] = (frameworkCounts[project.framework] || 0) + 1;
  });
  
  return Object.entries(frameworkCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'react';
}

function calculateGrowthRate(projects: any[], days: number): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  
  const recentProjects = projects.filter(p => new Date(p.createdAt) > cutoff).length;
  const totalProjects = projects.length;
  
  if (totalProjects === 0) return 0;
  
  // Simple growth calculation
  return Math.round((recentProjects / totalProjects) * 100);
}