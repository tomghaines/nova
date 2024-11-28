// app/layout.tsx
'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/sidebar';
import { SwitchDemo } from '@/components/dashboard/switch';
import './globals.css';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <SidebarProvider>
          <div className='flex min-h-screen w-full'>
            <AppSidebar />

            <div className='relative mr-10 mt-10 flex flex-1 justify-center'>
              <div className='fixed right-12 top-12'>
                <SwitchDemo />
              </div>

              <div className='absolute left-4 top-0 p-0'>
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
