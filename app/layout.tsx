// app/layout.tsx
'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SwitchMode } from '@/components/dashboard/switch';
import { AppSidebar } from '@/components/dashboard/sidebar';
import { useState } from 'react';
import './globals.css';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [isNightMode, setIsNightMode] = useState(false);

  const handleThemeToggle = () => {
    setIsNightMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  return (
    <html lang='en'>
      <body>
        <SidebarProvider>
          <div className='flex min-h-screen w-full'>
            <AppSidebar isNightMode={isNightMode} />

            <div className='relative mt-10 flex flex-1 justify-center'>
              <div className='fixed right-12 top-12'>
                <SwitchMode
                  isNightMode={isNightMode}
                  onThemeToggle={handleThemeToggle}
                />
              </div>

              <div className='absolute left-7 top-0 p-0'>
                <SidebarTrigger />
              </div>

              <div className='flex items-start justify-center'>{children}</div>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
