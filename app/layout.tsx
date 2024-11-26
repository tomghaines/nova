import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/sidebar';
import { SentimentChart } from '@/components/dashboard/chart';
import { CommandDemo } from '@/components/dashboard/command';
import { SwitchDemo } from '@/components/dashboard/switch';
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
            <div className='flex-1 relative w-full'>
              {/* Switch Component with Night/Day Mode */}
              <div className='fixed top-4 right-6'>
                <SwitchDemo />
              </div>
              {/* Sidebar Toggle Button */}
              <div className='top-0 left-0 p-2'>
                <SidebarTrigger />
              </div>
              {/* Main Content Area */}
              <div className='flex-1 flex items-center justify-center'>
                {/* Content Wrapper */}
                <div className='w-[80%] max-w-3xl text-center px-6'>
                  {/* Command Component */}
                  <div className='mb-8'>
                    <CommandDemo />
                  </div>
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
                  <SentimentChart />
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
