import { SidebarTrigger } from '@/components/ui/sidebar';
import { SwitchMode } from '@/components/features/dashboard/switch';

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

      <div className='fixed right-10 top-7 z-50'>
        <SwitchMode isNightMode={isNightMode} onThemeToggle={onThemeToggle} />
      </div>
    </nav>
  );
}
