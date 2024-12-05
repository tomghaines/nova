'use client';

import { useTheme } from '@/app/context/theme';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/features/sidebar/app-sidebar';
import { Navbar } from '../features/navbar/navbar';

interface RootContentProps {
  children: React.ReactNode;
}

export function RootContent({ children }: RootContentProps) {
  const { isNightMode, toggleTheme } = useTheme();

  return (
    <SidebarProvider defaultOpen={false}>
      <div className='flex h-auto w-full'>
        <AppSidebar />
        <main className='m-0 flex w-full flex-col'>
          <div className='h-12'>
            <Navbar isNightMode={isNightMode} onThemeToggle={toggleTheme} />
          </div>
          <div className='flex h-full w-full'>{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
