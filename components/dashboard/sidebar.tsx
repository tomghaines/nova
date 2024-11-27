import { Home, Inbox, Search, Settings, User2, ChevronUp } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Menu items.
const items = [
  {
    title: 'Home',
    url: '#',
    icon: Home
  },
  {
    title: 'Seek',
    url: '#',
    icon: Search
  },
  {
    title: 'Wander',
    url: '#',
    icon: Settings
  }
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <img
              src='/logo/logo.png'
              alt='Logo'
              className='mx-auto mt-24 h-12 w-auto'
            />
          </SidebarGroupLabel>
          <SidebarGroupContent className='ml-10 mt-24'>
            <SidebarMenu className='space-y-2'>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className='p-3 text-2xl font-extralight'>
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
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
              <span className='flex-1'>Username</span>
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
            <DropdownMenuItem>
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
