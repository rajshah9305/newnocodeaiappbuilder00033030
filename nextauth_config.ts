import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ token, session, user }) {
      if (session?.user && user) {
        session.user.id = user.id;
        
        // Fetch additional user data
        const userData = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            analytics: true,
            notifications: true,
          }
        });
        
        if (userData) {
          session.user.plan = userData.plan;
          session.user.analytics = userData.analytics;
        }
      }
      return session;
    },
    async jwt({ user, token }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        // Create default settings for new users
        if (user.id) {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                notifications: {
                  upsert: {
                    create: {
                      email: true,
                      deployment: true,
                      team: false,
                      marketing: false,
                    },
                    update: {},
                  }
                },
                analytics: {
                  upsert: {
                    create: {
                      totalProjects: 0,
                      totalViews: 0,
                      totalDownloads: 0,
                      activeProjects: 0,
                    },
                    update: {},
                  }
                }
              }
            });
          } catch (error) {
            console.error('Error creating user settings:', error);
          }
        }
      }
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      // Welcome email or other onboarding logic
      console.log(`New user created: ${user.email}`);
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };