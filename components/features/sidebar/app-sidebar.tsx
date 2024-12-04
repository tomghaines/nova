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
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
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
    title: 'Home',
    url: '/home',
    icon: Home
  },
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Mindshare',
    url: '',
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
      <SidebarContent className='flex h-screen flex-col items-center justify-between bg-zinc-100 align-middle dark:bg-neutral-950'>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className='flex flex-col gap-4'>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className='flex gap-2 text-lg focus:outline-none active:bg-transparent'
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <SidebarFooter className='mt-2 flex justify-center'>
            <DropdownMenu>
              <DropdownMenuTrigger
                className='hover:bg-neutral-200 hover:no-underline dark:text-neutral-300 dark:hover:bg-neutral-800'
                asChild
              >
                <SidebarMenuButton
                  tooltip={user.user_metadata.username || user.email}
                  className='flex items-center justify-center gap-2 p-2'
                >
                  <Avatar className='h-6 w-6 min-w-[24px] flex-shrink-0 overflow-hidden rounded-full'>
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
                        {user.user_metadata.username}
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
    </Sidebar>
  );
}
