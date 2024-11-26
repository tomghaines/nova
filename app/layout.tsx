import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { Component as ChartComponent } from '@/components/dashboard/chart';
import './globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <SidebarProvider>
          <div className='flex min-h-screen'>
            {/* Sidebar */}
            <AppSidebar />
            {/* Main Content Area */}
            <div className='flex-1 relative'>
              {/* Sidebar Toggle Button */}
              <div className='fixed top-4 left-[calc(250px+1rem)] z-50'>
                <SidebarTrigger />
              </div>
              {/* Centered Content */}
              <div className='flex items-center justify-center min-h-screen'>
                <div className='w-[80%] max-w-3xl text-center'>
                  {/* Title */}
                  <h1 className='text-4xl font-bold mb-4 text-gray-800'>
                    Sentiment Analysis
                  </h1>
                  {/* Description */}
                  <p className='mb-6 text-gray-600'>
                    The use of natural language processing, text analysis,
                    computational linguistics based on X (formerly Twitter) to
                    systematically study the market behaviors.
                  </p>
                  {/* Chart Component */}
                  <ChartComponent />
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
