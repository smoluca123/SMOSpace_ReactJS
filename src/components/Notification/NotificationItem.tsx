import { PopoverClose } from '@radix-ui/react-popover';
import ProfileLink from '../ProfileLink';
import UserAvatar from '../UserAvatar';

export default function NotificationItem() {
  const isReaded = false;

  return (
    <PopoverClose className='relative flex items-center w-full gap-4 p-4 text-left transition-colors duration-300 rounded-sm cursor-pointer hover:bg-accent'>
      <UserAvatar />

      <div className='flex-1 '>
        <div className='items-center justify-between gap-3 md:flex'>
          <div className=' line-clamp-2'>
            <ProfileLink username={'nguyenvana'} className='inline-block font-bold text-foreground'>
              Nguyen Van An
            </ProfileLink>{' '}
            <span>comment on your post in HTML/CSS VietNam </span>
          </div>
          <p className='ml-auto text-primary'>15m</p>
        </div>
      </div>

      {!isReaded && (
        <div className='absolute rounded-full size-[10px] bg-primary top-2 right-2 '></div>
      )}
    </PopoverClose>
  );
}
