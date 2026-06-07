'use client';

import { UUID } from 'crypto';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import FriendButton from '@/components/FriendButton';
import MessageButton from './MessageButton';
import FavoriteMenuItem from './FavoriteMenuItem';
import EditFriendListMenuItem from './EditFriendListMenuItem';
import ToggleFollowMenuItem from './ToggleFollowMenuItem';
import UnfriendMenuItem from './UnfriendMenuItem';
import BlockMenuItem from './BlockMenuItem';
import { useGetUserInfomation } from '@/lib/querys';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

interface IProps {
  userId: UUID;
}

export default function ProfileActions({ userId }: IProps) {
  const { user: currentUser } = useAppSelector(selectAuth);
  const { data: userInfo } = useGetUserInfomation({ userId });

  const friend = userInfo?.friend;
  const isFriend = friend?.status === 'ACCEPTED';
  const isBlocked = friend?.status === 'BLOCKED';
  // Block rows store the blocker in `userId`; only the blocker can unblock.
  const isBlockedByMe = isBlocked && friend?.userId === currentUser?.id;

  return (
    <div className='flex gap-2'>
      {/* When I've blocked this user, friend/message actions are unavailable */}
      {!isBlocked && (
        <>
          <FriendButton userId={userId} />
          <MessageButton userId={userId} />
        </>
      )}

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='secondary' size='icon'>
            <Ellipsis className='w-4 h-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
          {!isBlocked && (
            <>
              <FavoriteMenuItem userId={userId} />

              {isFriend && <EditFriendListMenuItem userId={userId} />}

              <ToggleFollowMenuItem userId={userId} />

              {isFriend && userInfo && <UnfriendMenuItem userData={userInfo} />}
            </>
          )}

          {/* Block / Unblock - hidden only when the other user blocked me */}
          {(!isBlocked || isBlockedByMe) && (
            <BlockMenuItem userId={userId} friend={friend} fullName={userInfo?.fullName} />
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
