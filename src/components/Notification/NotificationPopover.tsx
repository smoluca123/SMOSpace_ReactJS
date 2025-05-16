import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import Notification from './Notification';
import { useGetNotifications } from '@/components/Notification/querys';
import NotificationDot from '@/components/Notification/NotificationDot';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

export default function NotificationPopover() {
  const { isAuthenticated } = useAppSelector(selectAuth);
  const query = useGetNotifications({
    enabled: isAuthenticated,
  });

  const hasUnreadNotification = query.data?.pages[0].items.some(
    (notification) => !notification.isRead,
  );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className='relative'>
          <button className='~p-2/4 rounded-md hover:bg-accent'>
            <Bell />
          </button>
          {hasUnreadNotification && (
            <div className='absolute -top-0 -right-0'>
              <NotificationDot />
            </div>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        align='end'
        className=' border-border border p-0 w-screen  sm:w-[25rem]  max-w-lg '
      >
        <Notification query={query} />
      </PopoverContent>
    </Popover>
  );
}
