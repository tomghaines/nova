'use client';

import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/sidebar';
import { SentimentChart } from '@/components/dashboard/sentimentChart';
import { MindshareMap } from '@/components/dashboard/mindshareMap';
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
              {/* Sidebar */}
              <AppSidebar className='flex-none w-64' />
              
              {/* Main Content Area */}
              <div className='flex-1 relative w-full mt-10 mb-2 ml-2 mr-2'>
                {/* dark mode switch */}
                <div className='fixed top-4 right-6'>
                  <SwitchDemo />
                </div>
                
                {/* Sidebar Trigger */}
                <div className='absolute top-0 left-0 p-2'>
                  <SidebarTrigger />
                </div>
                
                {/* Main Content Wrapper */}
                <div className='flex flex-col items-center justify-start w-full '>
                  {/* Inner Container for Charts and Search */}
                  <div className='w-[90%] max-w-4xl text-center px-6 pl-[100px]'>
                    {/* Search Bar */}
                    <div className='mb-8'>
                      <CommandDemo />
                    </div>
                    
                    {/* Sentiment Chart Section */}
                    <div className='mb-16'>
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
                    
                    {/* Mindshare Map Section */}
                    <div>
                      <h1 className='text-4xl font-bold mb-4 text-gray-800'>
                        Mindshare Map
                      </h1>
                      <p className='mb-6 text-gray-600'>
                        A systematic representation of how the collective
                        attention on X shifts across critical concepts, aiding in
                        understanding market trends and focus distribution.
                      </p>
                      <MindshareMap />
                    </div>
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
