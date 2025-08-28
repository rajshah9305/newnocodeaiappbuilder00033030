import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/encryption';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { apiKeys: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const keys = user.apiKeys.map(key => ({
      id: key.id,
      name: key.name,
      service: key.service,
      masked: maskApiKey(decrypt(key.keyHash)),
      lastUsed: key.lastUsed?.toISOString(),
      status: 'active', // You could add validation logic here
      createdAt: key.createdAt.toISOString()
    }));

    return NextResponse.json({ keys });

  } catch (error) {
    console.error('API keys fetch error:', error);
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

    const { name, service, key } = await request.json();

    if (!name || !service || !key) {
      return NextResponse.json(
        { error: 'Name, service, and key are required' },
        { status: 400 }
      );
    }

    // Validate API key format
    if (!isValidApiKey(service, key)) {
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 400 }
      );
    }

    // Check if service already has a key for this user
    const existingKey = await prisma.apiKey.findFirst({
      where: { userId: user.id, service }
    });

    if (existingKey) {
      return NextResponse.json(
        { error: `API key for ${service} already exists` },
        { status: 400 }
      );
    }

    // Test API key validity
    const isValid = await testApiKey(service, key);
    if (!isValid) {
      return NextResponse.json(
        { error: 'API key is invalid or expired' },
        { status: 400 }
      );
    }

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        service,
        keyHash: encrypt(key),
        userId: user.id
      }
    });

    return NextResponse.json({
      key: {
        id: apiKey.id,
        name: apiKey.name,
        service: apiKey.service,
        masked: maskApiKey(key),
        status: 'active',
        createdAt: apiKey.createdAt.toISOString()
      }
    });

  } catch (error) {
    console.error('API key creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const keyId = searchParams.get('id');

    if (!keyId) {
      return NextResponse.json(
        { error: 'Key ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const apiKey = await prisma.apiKey.findFirst({
      where: { id: keyId, userId: user.id }
    });

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    await prisma.apiKey.delete({
      where: { id: keyId }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API key deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function maskApiKey(key: string): string {
  if (key.length <= 8) return '••••••••';
  return key.substring(0, 4) + '••••••••' + key.substring(key.length - 4);
}

function isValidApiKey(service: string, key: string): boolean {
  const patterns = {
    cerebras: /^[a-zA-Z0-9_-]{20,}$/,
    openai: /^sk-[a-zA-Z0-9]{48}$/,
    anthropic: /^sk-ant-[a-zA-Z0-9_-]{95,}$/
  };

  const pattern = patterns[service as keyof typeof patterns];
  return pattern ? pattern.test(key) : true; // Allow unknown services
}

async function testApiKey(service: string, key: string): Promise<boolean> {
  try {
    switch (service) {
      case 'cerebras':
        // Test Cerebras API key
        const response = await fetch('https://api.cerebras.ai/v1/models', {
          headers: { 'Authorization': `Bearer ${key}` }
        });
        return response.ok;
      
      case 'openai':
        // Test OpenAI API key
        const openaiResponse = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${key}` }
        });
        return openaiResponse.ok;
      
      default:
        // For other services, assume valid for now
        return true;
    }
  } catch (error) {
    console.error(`API key validation error for ${service}:`, error);
    return false;
  }
}