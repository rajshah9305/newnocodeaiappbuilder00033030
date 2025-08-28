import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AppGenius - Elite AI App Builder',
  description: 'Build professional web applications using AI-powered multi-agent orchestration with CrewAI and Cerebras.',
  keywords: 'AI, app builder, CrewAI, Cerebras, React, Next.js, web development',
  authors: [{ name: 'AppGenius Team' }],
  openGraph: {
    title: 'AppGenius - Elite AI App Builder',
    description: 'Build professional web applications using AI-powered multi-agent orchestration',
    url: 'https://appgenius.ai',
    siteName: 'AppGenius',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AppGenius - Elite AI App Builder'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AppGenius - Elite AI App Builder',
    description: 'Build professional web applications using AI-powered multi-agent orchestration',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-white">
            {children}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}