import { BarChart3, Home, HomeIcon, MessageSquare, Users } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Posts', href: '/admin/posts', icon: MessageSquare },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

export function AdminSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible='icon'>
      {/* Logo */}
      <SidebarHeader className='border-b border-border'>
        <div className='flex items-center px-2 py-3 space-x-3'>
          <div className='flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-primary'>
            <span className='text-sm font-bold text-primary-foreground'>SM</span>
          </div>
          <div className='group-data-[collapsible=icon]:hidden'>
            <h2 className='text-lg font-semibold leading-none text-foreground'>SMO Space</h2>
            <p className='text-xs text-muted-foreground'>Management Panel</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.name}>
                    <Link to={item.href} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className='border-t border-border'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip='Go Home Page'>
              <Button variant='ghost' className='justify-start w-full' onClick={() => { navigate('/'); setOpenMobile(false); }}>
                <HomeIcon />
                <span>Go Home Page</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className='px-2 pb-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden'>
          <p>Version 1.0.0</p>
          <p>© 2025 SMO Space Admin</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
