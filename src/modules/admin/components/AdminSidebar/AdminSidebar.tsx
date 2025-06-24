import { cn } from '@/lib/utils';
import { BarChart3, Home, MessageSquare, Users, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Posts',
    href: '/admin/posts',
    icon: MessageSquare,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
];

export function AdminSidebar() {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className='fixed z-50 lg:hidden top-4 left-4'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='shadow-md bg-background'
        >
          {isMobileMenuOpen ? <X className='w-4 h-4' /> : <Menu className='w-4 h-4' />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          'bg-card border-r border-border w-64 flex-shrink-0 transition-transform duration-200',
          'lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          'fixed lg:relative inset-y-0 left-0 z-40 shadow-lg lg:shadow-none',
        )}
      >
        <div className='flex flex-col h-full'>
          {/* Logo */}
          <div className='p-6 border-b border-border'>
            <div className='flex items-center space-x-3'>
              <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-primary'>
                <span className='text-sm font-bold text-primary-foreground'>SM</span>
              </div>
              <div>
                <h2 className='text-lg font-semibold text-foreground'>SMO Space</h2>
                <p className='text-xs text-muted-foreground'>Management Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className='flex-1 p-4 space-y-1'>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                  )}
                >
                  <item.icon className='w-5 h-5' />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className='p-4 border-t border-border'>
            <div className='text-xs text-muted-foreground'>
              <p>Version 1.0.0</p>
              <p>© 2025 SMO Space Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className='fixed inset-0 z-30 bg-black/20 lg:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
