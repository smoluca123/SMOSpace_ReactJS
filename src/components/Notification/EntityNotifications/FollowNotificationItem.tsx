import NotificationItem from '@/components/Notification/NotificationItem';
import { IFollowNotificationType } from '@/lib/types/interfaces';

interface FollowNotificationItemProps {
  notification: IFollowNotificationType;
}

export default function FollowNotificationItem({ notification }: FollowNotificationItemProps) {
  return (
    <NotificationItem notification={notification}>
      <span>started following you</span>
    </NotificationItem>
  );
}
