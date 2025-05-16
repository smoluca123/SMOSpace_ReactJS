import { ConfirmRequestButton, CancelRequestButton } from '../FriendRequestButtons';
import ProfileLink from '@/components/ProfileLink';
import { IFriendRequestWithFriendDataType } from '@/lib/types/interfaces';
import { formatRelativeDate } from '@/lib/utils';
import UserAvatar from '@/components/UserAvatar';

export default function FriendRequestItem({
  friendRequest,
}: {
  friendRequest: IFriendRequestWithFriendDataType;
}) {
  const { friend } = friendRequest;
  return (
    <div className='flex overflow-hidden flex-col w-full h-96 rounded-md border cursor-pointer hover:bg-accent border-border'>
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
      <div className='flex-[0.3] p-4 space-y-2'>
        <div className='block gap-y-4 justify-between md:flex'>
          <div className='flex-1 truncate whitespace-pre-line break-words line-clamp-1'>
            <ProfileLink username={friend.username} className='font-bold text-foreground'>
              {friend.fullName}
            </ProfileLink>
          </div>
          <p className='ml-auto text-sm text-primary'>
            {formatRelativeDate(new Date(friendRequest.createdAt))}
          </p>
        </div>

        {/* Actions */}
        <div className='flex gap-x-2'>
          <ConfirmRequestButton />
          <CancelRequestButton />
        </div>
      </div>
    </div>
  );
}
