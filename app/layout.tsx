'use client';

import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/sidebar';
import { SwitchDemo } from '@/components/dashboard/switch';
import './globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isNightMode, setIsNightMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    setIsNightMode(storedTheme === 'dark');
  }, []);

  const handleThemeChange = (newMode: boolean) => {
    setIsNightMode(newMode);
  };

  return (
    <html lang='en'>
      <body>
        <SidebarProvider>
          <div className='flex min-h-screen'>
            {/* Sidebar */}
            <AppSidebar isNightMode={isNightMode} />
            {/* Main Content Area */}
            <div className='relative mb-2 ml-2 mr-2 mt-10 w-full flex-1'>
              {/* dark mode switch */}
              <div className='fixed right-12 top-12'>
                <SwitchDemo onThemeChange={handleThemeChange} />
              </div>

              {/* Sidebar Trigger */}
              <div className='absolute left-4 top-0 p-0'>
                <SidebarTrigger />
              </div>

              <div>{children}</div>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
