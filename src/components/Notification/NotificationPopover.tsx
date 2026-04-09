import { Bell } from 'lucide-react';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import Notification from './Notification';
import { useGetGroupedNotifications, useGetNotifications } from '@/components/Notification/querys';
import NotificationDot from '@/components/Notification/NotificationDot';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

type NotificationViewMode = 'flat' | 'grouped';

export default function NotificationPopover() {
  const { isAuthenticated } = useAppSelector(selectAuth);
  const [viewMode, setViewMode] = useState<NotificationViewMode>('grouped');

  const flatQuery = useGetNotifications({
    enabled: isAuthenticated,
  });

  const groupedQuery = useGetGroupedNotifications({
    enabled: isAuthenticated,
    groupByTime: 24,
  });

  // Check for unread based on current view mode
  const hasUnreadNotification =
    viewMode === 'flat'
      ? flatQuery.data?.pages[0].items.some((notification) => !notification.isRead)
      : groupedQuery.data?.pages[0].items.some((group) => !group.isRead);

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
        className='border-border border p-0 w-screen sm:w-[25rem] max-w-lg'
      >
        <Notification
          flatQuery={flatQuery}
          groupedQuery={groupedQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </PopoverContent>
    </Popover>
  );
}
