import { Bell, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ModeToggle from '@/components/ModeToggle';
import UserButton from '@/components/UserButton';

export default function AdminHeader() {
  return (
    <header className='px-4 py-4 border-b bg-card border-border md:px-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='hidden md:block'>
            <h1 className='text-xl font-semibold text-foreground'>Dashboard</h1>
            <p className='text-sm text-muted-foreground'>Welcome back, Admin</p>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          {/* Search */}
          <div className='relative hidden md:block'>
            <Search className='absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground' />
            <Input placeholder='Search...' className='pl-10 w-80 bg-background' />
          </div>

          {/* Quick Actions */}
          <Button size='sm' className='hidden md:flex'>
            <Plus className='w-4 h-4 mr-2' />
            New Post
          </Button>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Notifications */}
          <Button variant='ghost' size='icon' className='relative'>
            <Bell className='w-5 h-5' />
            <Badge className='absolute w-5 h-5 p-0 text-xs -top-1 -right-1 bg-destructive text-destructive-foreground'>
              3
            </Badge>
          </Button>

          {/* User Menu */}

          <UserButton />
        </div>
      </div>
    </header>
  );
}
