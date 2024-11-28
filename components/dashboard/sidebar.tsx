'use client';

import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Home, Search, Settings, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const items = [
  {
    title: 'Home',
    url: '/home',
    icon: Home
  },
  {
    title: 'Seek',
    url: '/seek',
    icon: Search
  },
  {
    title: 'Wander',
    url: '/wander',
    icon: Settings
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
    <Sidebar className='bg-blue-500'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <img
              src={isNightMode ? '/logo/logo-dark.png' : '/logo/logo.png'}
              alt='Logo'
              className='mx-auto mt-24 h-12 w-auto'
            />
          </SidebarGroupLabel>
          <SidebarGroupContent className='ml-10 mt-24 w-40'>
            <SidebarMenu className='space-y-2'>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span className='p-3 text-2xl font-extralight'>
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
              <SidebarMenuButton className='flex items-center gap-2'>
                <Avatar className='h-6 w-6'>
                  <AvatarImage
                    src='https://github.com/shadcn.png'
                    alt='@shadcn'
                  />
                  <AvatarFallback>CN</AvatarFallback>
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
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Billing</span>
              </DropdownMenuItem>
              <form action={signOutAction} onSubmit={handleSignOut}>
                <DropdownMenuItem asChild>
                  <button type='submit' className='w-full text-left'>
                    <span>Sign out</span>
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
