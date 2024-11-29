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
    <html lang='en'>
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

        <div className='relative mt-10 flex flex-1 justify-center'>
          <div className='fixed right-12 top-12'>
            <SwitchMode isNightMode={isNightMode} onThemeToggle={toggleTheme} />
          </div>

          <div className='absolute left-7 top-0 p-0'>
            <SidebarTrigger />
          </div>

          <div className='flex items-start justify-center'>{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
