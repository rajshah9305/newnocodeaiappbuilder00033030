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
      where: { email: session.user.email },
      include: {
        teamMemberships: {
          include: {
            team: {
              include: {
                members: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all team members from user's teams
    const allMembers = user.teamMemberships.flatMap(membership =>
      membership.team.members.map(member => ({
        id: member.id,
        name: member.user.name || 'Unknown',
        email: member.user.email,
        avatar: member.user.image || '',
        role: member.role,
        status: member.status,
        lastActive: getRandomLastActive(), // In real app, track actual activity
        joinedAt: member.joinedAt.toISOString()
      }))
    );

    // Remove duplicates and current user
    const uniqueMembers = allMembers.filter((member, index, self) =>
      index === self.findIndex(m => m.email === member.email) && member.email !== user.email
    );

    return NextResponse.json({
      members: uniqueMembers,
      teamCount: user.teamMemberships.length
    });

  } catch (error) {
    console.error('Team fetch error:', error);
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

    const { action, email, role, teamName } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    switch (action) {
      case 'invite':
        if (!email || !role) {
          return NextResponse.json(
            { error: 'Email and role are required' },
            { status: 400 }
          );
        }

        // Find or create the invited user
        const invitedUser = await prisma.user.upsert({
          where: { email },
          create: {
            email,
            name: email.split('@')[0], // Use email prefix as default name
          },
          update: {}
        });

        // Create or find team (for simplicity, using user's personal team)
        let team = await prisma.team.findFirst({
          where: {
            members: {
              some: {
                userId: user.id,
                role: 'owner'
              }
            }
          }
        });

        if (!team) {
          team = await prisma.team.create({
            data: {
              name: teamName || `${user.name}'s Team`,
              slug: `${user.name?.toLowerCase().replace(/\s+/g, '-')}-team-${Date.now()}`,
              members: {
                create: {
                  userId: user.id,
                  role: 'owner',
                  status: 'active'
                }
              }
            }
          });
        }

        // Add new member
        const existingMember = await prisma.teamMember.findUnique({
          where: {
            userId_teamId: {
              userId: invitedUser.id,
              teamId: team.id
            }
          }
        });

        if (existingMember) {
          return NextResponse.json(
            { error: 'User already in team' },
            { status: 400 }
          );
        }

        await prisma.teamMember.create({
          data: {
            userId: invitedUser.id,
            teamId: team.id,
            role: role.toLowerCase(),
            status: 'pending'
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Invitation sent successfully'
        });

      case 'remove':
        if (!email) {
          return NextResponse.json(
            { error: 'Email is required' },
            { status: 400 }
          );
        }

        const userToRemove = await prisma.user.findUnique({
          where: { email }
        });

        if (!userToRemove) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Find team where current user is owner
        const teamToRemoveFrom = await prisma.team.findFirst({
          where: {
            members: {
              some: {
                userId: user.id,
                role: 'owner'
              }
            }
          }
        });

        if (!teamToRemoveFrom) {
          return NextResponse.json(
            { error: 'No team found or insufficient permissions' },
            { status: 403 }
          );
        }

        await prisma.teamMember.delete({
          where: {
            userId_teamId: {
              userId: userToRemove.id,
              teamId: teamToRemoveFrom.id
            }
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Member removed successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Team action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getRandomLastActive(): string {
  const options = ['now', '5 min ago', '1 hour ago', '2 hours ago', '1 day ago'];
  return options[Math.floor(Math.random() * options.length)];
}