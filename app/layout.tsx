'use client';

import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/sidebar';
import { SentimentChart } from '@/components/dashboard/chart';
import { CommandDemo } from '@/components/dashboard/command';
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
        {!isAuthenticated ? (
          <Auth onAuthenticate={handleAuthentication} />
        ) : (
          <SidebarProvider>
            <div className='flex min-h-screen'>
              <AppSidebar />
              <div className='flex-1 relative w-full'>
                <div className='fixed top-4 right-6'>
                  <SwitchDemo />
                </div>
                <div className='top-0 left-0 p-2'>
                  <SidebarTrigger />
                </div>
                <div className='flex-1 flex items-center justify-center'>
                  <div className='w-[80%] max-w-3xl text-center px-6'>
                    <div className='mb-8'>
                      <CommandDemo />
                    </div>
                    <h1 className='text-4xl font-bold mb-4 text-gray-800'>
                      Sentiment Analysis
                    </h1>
                    <p className='mb-6 text-gray-600'>
                      The use of natural language processing, text analysis,
                      computational linguistics based on X (formerly Twitter) to
                      systematically study the market behaviors.
                    </p>
                    <SentimentChart />
                  </div>
                </div>
              </div>
            </div>
          </SidebarProvider>
        )}
      </body>
    </html>
  );
}
