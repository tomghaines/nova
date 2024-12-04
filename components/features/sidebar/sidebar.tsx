'use client';

import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import {
  ChevronUp,
  Home,
  LayoutDashboard,
  Calendar,
  Compass
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
    title: 'HOME',
    url: '/home',
    icon: Home
  },
  {
    title: 'DASHBOARD',
    url: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'DISCOVER',
    url: '/discover',
    icon: Compass
  },
  {
    title: 'CATALYST CALENDAR',
    url: '/catalyst-calendar',
    icon: Calendar
  }
];

export function AppSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        router.refresh();
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    setUser(null);
    router.refresh();
  };

  return (
    <Sidebar collapsible='icon' className='transition-all duration-300'>
      <SidebarContent className='flex h-full flex-col'>
        <div className='mt-auto'>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className='w-auto focus:outline-none active:bg-transparent'
                    >
                      <Link href={item.url} className='flex items-center gap-2'>
                        <item.icon className='h-5 w-5' />
                        <span className='transition-all duration-300 group-data-[collapsible=icon]/sidebar:w-0 group-data-[collapsible=icon]/sidebar:opacity-0'>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {user && (
          <SidebarFooter className='mt-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip={user.user_metadata.username || user.email}
                  className='flex items-center gap-2 p-2'
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
                  <div className='flex items-center gap-2 overflow-hidden transition-all duration-300 group-data-[collapsible=icon]/sidebar:w-0 group-data-[collapsible=icon]/sidebar:opacity-0'>
                    <span className='min-w-0 truncate'>
                      {user.user_metadata.username || user.email}
                    </span>
                    <ChevronUp className='h-4 w-4 flex-shrink-0' />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side='top'
                className='w-[--radix-popper-anchor-width]'
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
