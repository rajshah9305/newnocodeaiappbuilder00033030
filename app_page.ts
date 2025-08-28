'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import EliteAppBuilder from '@/components/EliteAppBuilder';
import LandingPage from '@/components/LandingPage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <LandingPage />;
  }

  return <EliteAppBuilder />;
}