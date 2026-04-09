import NotificationItem from '@/components/Notification/NotificationItem';
import { IPostMentionNotificationType } from '@/lib/types/interfaces';

interface PostMentionNotificationItemProps {
  notification: IPostMentionNotificationType;
}

export default function PostMentionNotificationItem({
  notification,
}: PostMentionNotificationItemProps) {
  return (
    <NotificationItem notification={notification} to={`/post/${notification.metadata.postId}`}>
      <span className='text-sm'>mentioned you in a post</span>
    </NotificationItem>
  );
}
