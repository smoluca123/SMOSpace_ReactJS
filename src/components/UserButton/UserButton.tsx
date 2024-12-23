'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserAvatar from '@/components/UserAvatar';
import ThemeToggleMenuItem from '@/components/UserButton/ThemeToggleMenuItem';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout, selectAuth } from '@/redux/slices/authSlice';
import { Coins, LogOut, LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, PropsWithChildren, RefAttributes } from 'react';

export default function UserButton({ showName }: { showName?: boolean }) {
  const { user } = useAppSelector(selectAuth);

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='flex items-center gap-x-4 max-w-[10rem] cursor-pointer'>
              <UserAvatar fallbackName={user.fullName} avatarUrl={user.avatar} />
              {showName && (
                <h4 className='hidden truncate whitespace-nowrap break-words line-clamp-1 lg:block'>
                  {user.fullName}
                </h4>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-[17rem]'>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='flex gap-4 h-12'>
              <UserAvatar avatarUrl={user.avatar} fallbackName={user.fullName} className='size-5' />
              <h4 className='hidden truncate whitespace-nowrap break-words line-clamp-1 lg:block'>
                {user.fullName}
              </h4>
            </DropdownMenuItem>
            <MenuItem Icon={Coins}>Points: {user.credits}</MenuItem>
            {/* Logout */}
            <DropdownMenuItem className='flex gap-x-4 items-center h-12' onClick={handleLogout}>
              <LogOut className='!size-5 text-destructive' />
              Logout
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ThemeToggleMenuItem />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}

interface MenuItemProps extends PropsWithChildren {
  Icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
}
function MenuItem({ Icon, children }: MenuItemProps) {
  return (
    <DropdownMenuItem className='flex gap-x-4 items-center h-12'>
      <Icon className='!size-5 text-primary' />
      {children}
    </DropdownMenuItem>
  );
}
