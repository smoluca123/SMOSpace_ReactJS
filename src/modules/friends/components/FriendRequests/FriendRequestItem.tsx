import { ConfirmRequestButton, CancelRequestButton } from '../FriendRequestButtons';
import ProfileLink from '@/components/ProfileLink';
import { formatRelativeDate } from '@/lib/utils';
import UserAvatar from '@/components/UserAvatar';
import useFriendRequestContext from '@/hooks/useFriendRequestContext';
import { DeleteFriendButton } from '@/components/FriendButtons';
import { Button } from '@/components/ui/button';
import { Trash, User } from 'lucide-react';
import NameWithVerifiedIcon from '@/components/NameWithVerifiedIcon';
import NameWithBadge from '@/components/NameWithBadge';

export default function FriendRequestItem() {
  const { friendRequest } = useFriendRequestContext();
  const { friend } = friendRequest;
  return (
    <div className='flex overflow-hidden flex-col w-full max-h-96 rounded-md border cursor-pointer hover:bg-accent border-border'>
      {/* Avatar */}
      <div className='overflow-hidden relative flex-1 w-full bg-black'>
        <UserAvatar
          className='object-contain rounded-none size-full'
          avatarUrl={friend.avatar}
          fallbackName={friend.fullName}
        />
        {/* <div className=''>
          <img src={userData.avatar} alt={userData.fullName} className='size-full' />
        </div> */}
      </div>

      {/* Content */}
      <div className='flex-[0.3] p-4 space-y-3 '>
        {/* Header */}
        <div className='block gap-y-4 justify-between md:flex'>
          <div className='flex-1 truncate whitespace-pre-line break-words line-clamp-1'>
            <ProfileLink username={friend.username} className='font-bold text-foreground'>
              <NameWithBadge userData={friend}>
                <NameWithVerifiedIcon isVerified={friend.isVerified}>
                  {friend.fullName}
                </NameWithVerifiedIcon>
              </NameWithBadge>
            </ProfileLink>
          </div>
          <p className='ml-auto text-sm text-primary'>
            {formatRelativeDate(new Date(friendRequest.createdAt))}
          </p>
        </div>

        {/* Actions */}
        <FriendRequestActions />
      </div>
    </div>
  );
}

function FriendRequestActions() {
  const { friendRequest } = useFriendRequestContext();
  return (
    <>
      {friendRequest.status === 'PENDING' && (
        <div className='space-y-2'>
          <ConfirmRequestButton />
          <CancelRequestButton />
        </div>
      )}
      {friendRequest.status === 'ACCEPTED' && (
        <div className='space-y-2'>
          <ProfileLink username={friendRequest.friend.username} className='w-full'>
            <Button className='w-full text-white' variant='outline-primary'>
              <User className='w-4 h-4' />
              Profile
            </Button>
          </ProfileLink>
          <DeleteFriendButton userData={friendRequest.friend}>
            <Trash className='w-4 h-4' />
            Unfriend
          </DeleteFriendButton>
        </div>
      )}
    </>
  );
}
