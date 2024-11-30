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

        <div className='flex flex-col flex-1 justify-center'>
          {/* sidebar trigger and darkmode trigger */}
          <div className='flex flex-row justify-between items-center mt-10'>
            <div className='ml-7'>
              <SidebarTrigger />
            </div>
            <div className='mr-7'>
              <SwitchMode isNightMode={isNightMode} onThemeToggle={toggleTheme} />
            </div>
          </div>
          {/* children component */}
          <div className='flex items-start justify-center mt-5'>{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
