import { PopoverClose } from '@radix-ui/react-popover';
import ProfileLink from '../ProfileLink';
import UserAvatar from '../UserAvatar';
import { PropsWithChildren } from 'react';
import { INotificationType } from '@/lib/types/interfaces';
import useTimeDistance from '@/hooks/useTimeDistance';
import { Link } from 'react-router-dom';
import NotificationDot from '@/components/Notification/NotificationDot';

interface NotificationItemProps extends PropsWithChildren {
  notification: INotificationType;
  to?: string;
}

export default function NotificationItem({ children, notification, to }: NotificationItemProps) {
  const timeDistance = useTimeDistance({ dateString: notification.createdAt });

  return (
    <PopoverClose className='w-full'>
      <Link
        to={to ?? ''}
        className='flex relative gap-4 items-center p-3 w-full text-left rounded-sm transition-colors duration-300 cursor-pointer hover:bg-accent'
      >
        {/* Avatar */}
        <UserAvatar
          avatarUrl={notification.sender.avatar}
          fallbackName={notification.sender.fullName}
        />

        {/* Notification content */}
        <div className='flex-1'>
          <div className='gap-3 justify-between items-center md:flex'>
            <div className='line-clamp-3'>
              <ProfileLink
                username={notification.sender.username}
                className='inline-block font-semibold text-foreground'
              >
                {notification.sender.fullName}
              </ProfileLink>{' '}
              {children}
            </div>
          </div>
          <p className='ml-auto text-sm text-primary'>{timeDistance}</p>
        </div>

        {/* Unreaded dot */}
        {!notification.isRead && <NotificationDot />}
      </Link>
    </PopoverClose>
  );
}
