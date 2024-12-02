'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SwitchMode } from '@/components/features/dashboard/switch';
import { AppSidebar } from '@/components/features/dashboard/sidebar';
import { ThemeProvider, useTheme } from '@/app/context/theme';
import './globals.css';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='dark'>
      <body>
        <ThemeProvider>
          <RootContent>{children}</RootContent>
        </ThemeProvider>
      </body>
    </html>
  );
}

function RootContent({ children }: { children: React.ReactNode }) {
  const { isNightMode, toggleTheme } = useTheme();

  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full'>
        <AppSidebar isNightMode={isNightMode} />

        <div className='flex flex-1 flex-col justify-center'>
          {/* top navbar */}
          <div className='bg-blur fixed top-0 z-50 flex h-20 w-full justify-between border-b-2 bg-white bg-opacity-90 dark:bg-black'>
            {/* Element #1: Sidebar Trigger */}
            <div className='ml-7 mt-6'>
              <SidebarTrigger />
            </div>
            {/* Element #2: Logo */}
            <div className='fixed left-1/2 top-6 z-50 -translate-x-1/2 transform'>
              <img
                src={
                  isNightMode ? '/logo/logo-dark.png' : '/logo/logo-light.png'
                }
                alt='Logo'
                className='h-9 w-auto'
              />
            </div>
            {/* Element #3: Theme Toggle */}
            <div className='fixed right-10 top-7 z-50'>
              <SwitchMode
                isNightMode={isNightMode}
                onThemeToggle={toggleTheme}
              />
            </div>
          </div>

          {/* children component */}
          <div className='flex items-start justify-center'>{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
