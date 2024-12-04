import { SidebarTrigger } from '@/components/ui/sidebar';
import { IconButton } from '@radix-ui/themes';
import { MoonStar, Sun } from 'lucide-react';

interface NavbarProps {
  isNightMode: boolean;
  onThemeToggle: () => void;
}

export function Navbar({ isNightMode, onThemeToggle }: NavbarProps) {
  return (
    <nav className='bg-blur flex h-full w-full justify-between border-b-[1px] border-neutral-500/50 bg-white bg-opacity-90 p-1 dark:bg-black/30'>
      <div className=''>
        <SidebarTrigger />
      </div>

      <div className='translate-x-1/2 transform'>
        <img
          src={isNightMode ? '/logo/logo-dark.png' : '/logo/logo-light.png'}
          alt='Logo'
          className='h-8 w-auto'
        />
      </div>

      <div className='rounded-lg border-[1px] border-neutral-200 dark:border-neutral-700/50'>
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
