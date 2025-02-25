'use client';

import DropdownMenuItemWithIcon from '@/components/DropdownMenuItemWithIcon';
import NameWithVerifiedIcon from '@/components/NameWithVerifiedIcon';
import { Button } from '@/components/ui/button';
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
import { IUserWithAccessTokenType } from '@/lib/types/interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout, selectAuth } from '@/redux/slices/authSlice';
import { Coins, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserButtonProps {
  showName?: boolean;
}

const UserMenuContent = ({
  user,
  onLogout,
}: {
  user: IUserWithAccessTokenType;
  onLogout: () => void;
}) => (
  <>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />

    <UserMenuItem user={user} />
    <DropdownMenuItemWithIcon Icon={Coins} className='h-12'>
      Points: {user.credits}
    </DropdownMenuItemWithIcon>

    <DropdownMenuItemWithIcon
      Icon={LogOut}
      className='h-12'
      variant='destructive'
      onClick={onLogout}
    >
      Logout
    </DropdownMenuItemWithIcon>
  </>
);

const UserMenuItem = ({ user }: { user: IUserWithAccessTokenType }) => (
  <DropdownMenuItem className='flex h-12 gap-4'>
    <UserAvatar avatarUrl={user.avatar} fallbackName={user.fullName} className='size-5' />
    <NameWithVerifiedIcon isVerified={user.isVerified}>
      <h4 className='font-medium break-words truncate whitespace-nowrap line-clamp-1'>
        {user.fullName}
      </h4>
    </NameWithVerifiedIcon>
  </DropdownMenuItem>
);

const GuestMenuContent = () => (
  <DropdownMenuItem asChild className='focus:bg-transparent'>
    <div className='flex gap-x-2' onClick={(e) => e.preventDefault()}>
      <Link to='/auth/login' className='block w-full'>
        <Button variant='outline' className='w-full text-primary border-primary'>
          Login
        </Button>
      </Link>
      <Link to='/auth/register' className='block w-full'>
        <Button className='w-full text-white'>Register</Button>
      </Link>
    </div>
  </DropdownMenuItem>
);

export default function UserButton({ showName }: UserButtonProps) {
  const { user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const handleLogout = () => dispatch(logout());

  return (
    <DropdownMenu>
      {user ? (
        <DropdownMenuTrigger asChild>
          <div className='flex items-center gap-x-4 max-w-[10rem] cursor-pointer'>
            <UserAvatar fallbackName={user.fullName} avatarUrl={user.avatar} />
            {showName && (
              <h4 className='hidden font-medium break-words truncate whitespace-nowrap line-clamp-1 lg:block'>
                {user.fullName}
              </h4>
            )}
          </div>
        </DropdownMenuTrigger>
      ) : (
        <DropdownMenuTrigger asChild>
          <Link to='/auth/login'>
            <Button className='text-foreground'>Join now!</Button>
          </Link>
        </DropdownMenuTrigger>
      )}

      <DropdownMenuContent className='w-[17rem]'>
        {user ? <UserMenuContent user={user} onLogout={handleLogout} /> : <GuestMenuContent />}
        <DropdownMenuSeparator />
        <ThemeToggleMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
