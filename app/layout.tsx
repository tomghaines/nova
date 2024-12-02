'use client';

import { ThemeProvider } from '@/app/context/theme';
import { RootContent } from '@/components/root-content';
import '@radix-ui/themes/styles.css';
import './globals.css';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='dark'>
      <body>
        <ThemeProvider>
          <RootContent>{children}</RootContent>
        </ThemeProvider>
      </body>
    </html>
  );
}
