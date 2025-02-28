import UserAvatar from '@/components/UserAvatar';
import { UserRoundPlus } from 'lucide-react';
import ConfirmRequestButton from './ConfirmRequestButton';
import CancelRequestButton from './CancelRequestButton';
import ProfileLink from '@/components/ProfileLink';

export default function FriendRequestItem() {
  return (
    <div className='p-2 w-full rounded-[8px] flex items-center gap-x-5 cursor-pointer hover:bg-accent transition-colors duration-300'>
      {/* Avatar */}
      <div className='relative rounded-full size-14'>
        <UserAvatar className='size-14' />
        <UserRoundPlus className='size-[27px] p-1 bg-primary rounded-full absolute text-white  bottom-0 right-0 translate-y-1/2' />
      </div>

      {/* Content */}
      <div className='flex-1 '>
        <div className='justify-between md:flex gap-y-4'>
          <div className=' line-clamp-2'>
            <ProfileLink username={'nguyenvana'} className='font-bold text-foreground'>
              Phạm Nhật Vượng
            </ProfileLink>{' '}
            <span>sent you a friend request.</span>
          </div>
          <p className='ml-auto text-primary'>15m</p>
        </div>

        {/* Actions */}
        <div className='flex items-center mt-2 font-semibold gap-x-2 lg:gap-x-5'>
          <ConfirmRequestButton />
          <CancelRequestButton />
        </div>
      </div>
    </div>
  );
}
