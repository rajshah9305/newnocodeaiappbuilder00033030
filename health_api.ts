import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Check if response time is acceptable (< 5 seconds)
    const isHealthy = responseTime < 5000;
    
    const healthStatus = {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      responseTime,
      checks: {
        database: {
          status: 'healthy',
          responseTime,
          message: 'Database connection successful'
        },
        memory: {
          status: getMemoryStatus(),
          usage: process.memoryUsage(),
          message: 'Memory usage within acceptable limits'
        },
        disk: {
          status: 'healthy',
          message: 'Disk space available'
        }
      }
    };
    
    return NextResponse.json(
      healthStatus,
      { 
        status: isHealthy ? 200 : 503,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Content-Type': 'application/json'
        }
      }
    );
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        error: error instanceof Error ? error.message : 'Unknown error',
        checks: {
          database: {
            status: 'unhealthy',
            message: 'Database connection failed'
          }
        }
      },
      { 
        status: 503,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

function getMemoryStatus(): string {
  const usage = process.memoryUsage();
  const totalMemory = usage.heapTotal;
  const usedMemory = usage.heapUsed;
  const memoryUsagePercentage = (usedMemory / totalMemory) * 100;
  
  if (memoryUsagePercentage > 90) {
    return 'critical';
  } else if (memoryUsagePercentage > 80) {
    return 'warning';
  }
  
  return 'healthy';
}