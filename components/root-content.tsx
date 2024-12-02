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
        <main className='flex flex-1 flex-col justify-center'>
          <Navbar isNightMode={isNightMode} onThemeToggle={toggleTheme} />
          <div className='flex items-start justify-center'>{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
