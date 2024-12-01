'use client';

import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
    url: '/home'
  },
  {
    title: 'SEEK',
    url: '/seek'
  },
  {
    title: 'WANDER',
    url: '/wander'
  }
];

export function AppSidebar({ isNightMode }: { isNightMode: boolean }) {
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

    // Set up auth state change listener
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
  }, [supabase, router]);

  const handleSignOut = async () => {
    setUser(null);
    router.refresh();
  };

  return (
    <Sidebar>
      <SidebarContent className=''>
        <SidebarGroup>
          <SidebarGroupContent className='mt-24 w-full'>
            <SidebarMenu className='space-y-6'>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <span className='h-18 dark:border-invert mt-6 w-full border-t-2 border-gray-600 p-2 text-xl font-thin'>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {user && (
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className='flex justify-around gap-1'>
                <Avatar className='h-6 w-6 overflow-hidden rounded-full'>
                  <AvatarImage
                    src={
                      user.user_metadata.avatar_url
                        ? user.user_metadata.avatar_url
                        : 'https://github.com/shadcn.png'
                    }
                    alt='@shadcn'
                  />
                </Avatar>
                <span className='flex-1'>{user.email}</span>
                <ChevronUp className='ml-2' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side='top'
              className='w-[--radix-popper-anchor-width]'
            >
              <DropdownMenuItem>
                <Button className='w-full text-left'>
                  <a href='/account'>Account</a>
                </Button>
              </DropdownMenuItem>
              <form action={signOutAction} onSubmit={handleSignOut}>
                <DropdownMenuItem asChild>
                  <Button type='submit' className='w-full hover:cursor-pointer'>
                    <a href='/home'>Sign out</a>
                  </Button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
