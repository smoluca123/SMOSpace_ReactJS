import { PopoverClose } from '@radix-ui/react-popover';
import ProfileLink from '../ProfileLink';
import UserAvatar from '../UserAvatar';

export default function NotificationItem() {
  const isReaded = false;

  return (
    <PopoverClose className='flex relative gap-4 items-center p-4 w-full text-left rounded-sm transition-colors duration-300 cursor-pointer hover:bg-accent'>
      {/* Avatar */}
      <UserAvatar />

      {/* Notification content */}
      <div className='flex-1'>
        <div className='gap-3 justify-between items-center md:flex'>
          <div className='line-clamp-2'>
            <ProfileLink
              username={'nguyenvana'}
              className='inline-block font-semibold text-foreground'
            >
              Nguyen Van An
            </ProfileLink>{' '}
            <span>comment on your post in HTML/CSS VietNam </span>
          </div>
          <p className='ml-auto text-sm text-primary'>15m</p>
        </div>
      </div>

      {/* Unreaded dot */}
      {!isReaded && (
        <div className='absolute rounded-full size-[10px] bg-primary top-2 right-2 '></div>
      )}
    </PopoverClose>
  );
}
