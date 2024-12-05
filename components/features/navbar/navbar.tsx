import { IconButton } from '@radix-ui/themes';
import { MoonStar, Sun } from 'lucide-react';

interface NavbarProps {
  isNightMode: boolean;
  onThemeToggle: () => void;
}

export function Navbar({ isNightMode, onThemeToggle }: NavbarProps) {
  return (
    <nav className='bg-blur flex h-full w-full items-center justify-between border-b-[1px] border-neutral-500/50 bg-white bg-opacity-90 p-2 dark:bg-black/30'>
      <div className=''></div>

      <div className='translate-x-1/2 transform'>
        <img
          src={isNightMode ? '/logo/logo-dark.png' : '/logo/logo-light.png'}
          alt='Logo'
          className='h-8 w-auto'
        />
      </div>

      <IconButton
        size='2'
        className='mr cursor-pointer bg-neutral-100 p-1 text-black hover:bg-neutral-300 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700'
        onClick={onThemeToggle}
      >
        {isNightMode ? <Sun /> : <MoonStar />}
      </IconButton>
    </nav>
  );
}
