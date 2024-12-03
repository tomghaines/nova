'use client';

import { ThemeProvider } from '@/app/context/theme';
import { RootContent } from '@/components/layouts/root-content';
import { Theme } from '@radix-ui/themes';
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
          <Theme>
            <RootContent>{children}</RootContent>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
