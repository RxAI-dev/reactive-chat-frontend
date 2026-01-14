'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { Header } from './header';
import { Sidebar } from './sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function MainLayout({ children, requireAuth = true }: MainLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isSidebarOpen } = useAppStore();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push('/login');
    }
  }, [requireAuth, isAuthenticated, router]);

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main
          className={`
            flex-1 flex flex-col overflow-hidden
            transition-all duration-200
            ${isSidebarOpen ? '' : 'w-full'}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
