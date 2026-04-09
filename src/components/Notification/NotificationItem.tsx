import { PopoverClose } from '@radix-ui/react-popover';
import ProfileLink from '../ProfileLink';
import UserAvatar from '../UserAvatar';
import { PropsWithChildren } from 'react';
import { INotificationType } from '@/lib/types/interfaces';
import useTimeDistance from '@/hooks/useTimeDistance';
import { useNavigate } from 'react-router-dom';
import NotificationDot from '@/components/Notification/NotificationDot';
import { useChangeNotificationStatus } from '@/components/Notification/mutations';

interface NotificationItemProps extends PropsWithChildren {
  notification: INotificationType;
  to?: string;
}

export default function NotificationItem({ children, notification, to }: NotificationItemProps) {
  const timeDistance = useTimeDistance({ dateString: notification.createdAt });
  const { mutateAsync: changeNotificationStatus } = useChangeNotificationStatus();
  const navigate = useNavigate();

  return (
    <PopoverClose className='w-full'>
      <div
        onClick={() => {
          changeNotificationStatus({
            notificationId: notification.id,
            isRead: true,
          });
          navigate(to ?? '');
        }}
        className='flex relative gap-4 items-center p-3 w-full text-left rounded-sm transition-colors duration-300 cursor-pointer hover:bg-accent'
      >
        {/* Avatar with border wrapper */}
        <div className='relative border-2 border-background rounded-full'>
          <UserAvatar
            avatarUrl={notification.sender.avatar}
            fallbackName={notification.sender.fullName}
            className='w-8 h-8'
          />
        </div>

        {/* Notification content */}
        <div className='flex-1'>
          <div className='gap-3 justify-between items-center md:flex'>
            <div className='line-clamp-3'>
              <span className='text-sm'>
                <ProfileLink
                  username={notification.sender.username}
                  className='inline-block text-foreground'
                >
                  {notification.sender.fullName}
                </ProfileLink>{' '}
                {children}
              </span>
            </div>
          </div>
          <div className='flex items-center gap-2 mt-1'>
            <p className='text-sm text-primary'>{timeDistance}</p>
          </div>
        </div>

        {/* Unread dot */}
        {!notification.isRead && <NotificationDot />}
      </div>
    </PopoverClose>
  );
}
