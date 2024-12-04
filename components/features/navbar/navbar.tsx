import { SidebarTrigger } from '@/components/ui/sidebar';
import { IconButton } from '@radix-ui/themes';
import { MoonStar, Sun } from 'lucide-react';

interface NavbarProps {
  isNightMode: boolean;
  onThemeToggle: () => void;
}

export function Navbar({ isNightMode, onThemeToggle }: NavbarProps) {
  return (
    <nav className='bg-blur fixed top-0 z-50 flex h-20 w-full justify-between border-b-2 bg-white bg-opacity-90 dark:bg-black dark:bg-opacity-90'>
      <div className='ml-7 mt-6'>
        <SidebarTrigger />
      </div>

      <div className='fixed left-1/2 top-6 z-50 -translate-x-1/2 transform'>
        <img
          src={isNightMode ? '/logo/logo-dark.png' : '/logo/logo-light.png'}
          alt='Logo'
          className='h-9 w-auto'
        />
      </div>

      <div className='fixed right-10 top-5 z-50 rounded-lg border-[2px] border-neutral-200 dark:border-neutral-700'>
        <IconButton
          size='3'
          className='cursor-pointer bg-neutral-100 text-black hover:bg-neutral-300 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800'
          onClick={onThemeToggle}
        >
          {isNightMode ? <Sun /> : <MoonStar />}
        </IconButton>
      </div>
    </nav>
  );
}
