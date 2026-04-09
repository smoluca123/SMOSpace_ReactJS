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

interface IProps {
  userId: UUID;
}

export default function ProfileActions({ userId }: IProps) {
  // TODO: Get actual friend status from API/context
  const isFriend = false; // This will be replaced with actual friend status

  return (
    <div className='flex gap-2'>
      {/* Friend Button */}
      <FriendButton userId={userId} />

      {/* Message Button */}
      <MessageButton userId={userId} />

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='secondary' size='icon'>
            <Ellipsis className='w-4 h-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
          <FavoriteMenuItem userId={userId} />

          {isFriend && <EditFriendListMenuItem userId={userId} />}

          <ToggleFollowMenuItem userId={userId} />

          {isFriend && <UnfriendMenuItem userId={userId} />}

          <BlockMenuItem userId={userId} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
