'use client';

import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/sidebar';
import { SwitchDemo } from '@/components/dashboard/switch';
import Auth from '@/components/features/auth';
import './globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthentication = () => {
    setIsAuthenticated(true); // Update state when Auth signals success
  };

  return (
    <html lang='en'>
      <body>
          <SidebarProvider>
            <div className='flex min-h-screen'>
              {/* Sidebar */}
              <AppSidebar />
              {/* Main Content Area */}
              <div className='relative mb-2 ml-2 mr-2 mt-10 w-full flex-1'>
                {/* dark mode switch */}
                <div className='fixed right-12 top-12'>
                  <SwitchDemo />
                </div>

                {/* Sidebar Trigger */}
                <div className='absolute left-0 top-0 p-2'>
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
