import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import {
  ChevronUp,
  Home,
  LayoutDashboard,
  Calendar,
  Compass,
  Brain
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
  SidebarSeparator
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import supabase from '@/utils/supabase/client';
import { signOutAction } from '@/app/actions';
import Link from 'next/link';
import { Button } from '@radix-ui/themes';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Mindshare',
    url: '/mindshare',
    icon: Brain
  },
  {
    title: 'Discover',
    url: '/discover',
    icon: Compass
  },
  {
    title: 'Catalyst Calendar',
    url: '/catalyst-calendar',
    icon: Calendar
  }
];

export function AppSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    fetchUser();
  }, [router]);

  const handleSignOut = async () => {
    setUser(null);
    router.refresh();
  };

  return (
    <Sidebar collapsible='icon' className='transition-all duration-300'>
      <SidebarContent className='flex h-screen flex-col items-center justify-between overflow-x-hidden bg-zinc-100 align-middle dark:bg-neutral-950'>
        <SidebarMenu className='flex flex-col gap-3 p-3'>
          <SidebarMenuItem key='home'>
            <SidebarMenuButton
              asChild
              tooltip='Home'
              className='flex gap-2 text-lg focus:outline-none active:bg-transparent'
            >
              <Link
                href='/home'
                className='flex items-center gap-2 hover:bg-neutral-200 hover:no-underline dark:hover:bg-neutral-800'
              >
                <Home className='dark:text-neutral-500' />
                <span className='font-semibold transition-all duration-300 group-data-[collapsible=icon]/sidebar:w-0 group-data-[collapsible=icon]/sidebar:opacity-0 dark:text-neutral-400'>
                  Home
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator />

          <SidebarGroupLabel className='text-md font-bold'>
            Tools
          </SidebarGroupLabel>
          <div className='flex flex-col gap-4'>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className='text-lg focus:outline-none active:bg-transparent'
                >
                  <Link
                    href={item.url}
                    className='flex items-center gap-2 hover:bg-neutral-200 hover:no-underline dark:hover:bg-neutral-800'
                  >
                    <item.icon className='dark:text-neutral-500' />
                    <span className='font-semibold transition-all duration-300 group-data-[collapsible=icon]/sidebar:w-0 group-data-[collapsible=icon]/sidebar:opacity-0 dark:text-neutral-400'>
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </div>
        </SidebarMenu>

        {user && (
          <SidebarFooter className='p-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className='flex w-full items-center justify-center group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!pl-3.5'
                  tooltip={
                    user?.user_metadata?.username ||
                    user?.identities?.[0]?.identity_data?.full_name ||
                    'User'
                  }
                >
                  <Avatar className='h-6 w-6 min-w-[24px] overflow-hidden rounded-full'>
                    <AvatarImage
                      src={
                        user.user_metadata.avatar_url ||
                        'https://github.com/shadcn.png'
                      }
                      alt='User avatar'
                    />
                  </Avatar>
                  <div className='flex items-center justify-between gap-2 overflow-hidden transition-all duration-300 group-data-[collapsible=icon]/sidebar:w-0 group-data-[collapsible=icon]/sidebar:opacity-0'>
                    <div className='flex flex-col text-[0.8rem]'>
                      <span className='min-w-0 font-bold'>
                        {user.user_metadata.username ||
                          user?.identities?.[0]?.identity_data?.full_name}
                      </span>
                      <span className='min-w-0'>{user.email}</span>
                    </div>
                    <ChevronUp className='flex-shrink-0' />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side='top'
                className='w-[--radix-popper-anchor-width] dark:border-zinc-700 dark:bg-neutral-900'
              >
                <DropdownMenuItem>
                  <Link href='/account' className='w-full'>
                    <Button className='w-full cursor-pointer'>Account</Button>
                  </Link>
                </DropdownMenuItem>
                <form action={signOutAction} onSubmit={handleSignOut}>
                  <DropdownMenuItem asChild>
                    <Button
                      type='submit'
                      className='w-full hover:cursor-pointer'
                    >
                      Sign out
                    </Button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
