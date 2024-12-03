'use client';

import { useTheme } from '@/app/context/theme';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/features/dashboard/sidebar';
import { Navbar } from './features/navbar/navbar';

interface RootContentProps {
  children: React.ReactNode;
}

export function RootContent({ children }: RootContentProps) {
  const { isNightMode, toggleTheme } = useTheme();

  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full'>
        <AppSidebar isNightMode={isNightMode} />
        <main className='flex flex-1 flex-col'>
          <Navbar isNightMode={isNightMode} onThemeToggle={toggleTheme} />
          <div className='mt-20 flex w-full'>{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
