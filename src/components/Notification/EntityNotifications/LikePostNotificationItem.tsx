import NotificationItem from '@/components/Notification/NotificationItem';
import { ILikePostNotificationType } from '@/lib/types/interfaces';

interface LikePostNotificationItemProps {
  notification: ILikePostNotificationType;
}

export default function LikePostNotificationItem({ notification }: LikePostNotificationItemProps) {
  switch (notification.type.type) {
    case 'LIKE_POST':
      return (
        <NotificationItem notification={notification} to={`/post/${notification.metadata.postId}`}>
          <span className='text-sm'>liked your post</span>
        </NotificationItem>
      );
    default:
      return null;
  }
}
