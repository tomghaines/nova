import { SidebarTrigger } from '@/components/ui/sidebar';
import { SwitchMode } from '@/components/features/dashboard/switch';

interface NavbarProps {
  isNightMode: boolean;
  onThemeToggle: () => void;
}

export function Navbar({ isNightMode, onThemeToggle }: NavbarProps) {
  return (
    <nav className='bg-blur sticky top-0 flex h-20 justify-between border-b-2 bg-white bg-opacity-90 dark:bg-black dark:bg-opacity-90'>
      <div className='ml-7 mt-6'>
        <SidebarTrigger />
      </div>

      <img
        src={isNightMode ? '/logo/logo-dark.png' : '/logo/logo-light.png'}
        alt='Logo'
        className='mx-auto mt-6 h-9 w-auto'
      />

      <div className='mb-3 mr-12 mt-7'>
        <SwitchMode isNightMode={isNightMode} onThemeToggle={onThemeToggle} />
      </div>
    </nav>
  );
}
