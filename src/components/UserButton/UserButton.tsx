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
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { Coins, LucideProps } from 'lucide-react';
import {
  ForwardRefExoticComponent,
  PropsWithChildren,
  RefAttributes,
} from 'react';

export default function ProfileButton({ showName }: { showName?: boolean }) {
  const { user } = useAppSelector(selectAuth);

  return (
    <>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-x-4 max-w-[10rem] cursor-pointer">
              <UserAvatar
                fallbackName={user.fullName}
                avatarUrl={user.avatar}
              />
              {showName && (
                <h4 className="hidden truncate whitespace-nowrap break-words line-clamp-1 lg:block">
                  {user.fullName}
                </h4>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[17rem]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex gap-4 h-12">
              <UserAvatar
                avatarUrl={user.avatar}
                fallbackName={user.fullName}
                className="size-5"
              />
              <h4>{user.fullName}</h4>
            </DropdownMenuItem>
            <MenuItem Icon={Coins}>Points: {user.credits}</MenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
            <DropdownMenuSeparator />
            <ThemeToggleMenuItem />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}

interface MenuItemProps extends PropsWithChildren {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
}
function MenuItem({ Icon, children }: MenuItemProps) {
  return (
    <DropdownMenuItem className="flex gap-x-4 items-center h-12">
      <Icon className="!size-5 text-primary" />
      {children}
    </DropdownMenuItem>
  );
}
