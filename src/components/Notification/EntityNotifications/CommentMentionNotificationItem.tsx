import NotificationItem from '@/components/Notification/NotificationItem';
import { ICommentMentionNotificationType } from '@/lib/types/interfaces';

interface CommentMentionNotificationItemProps {
  notification: ICommentMentionNotificationType;
}

export default function CommentMentionNotificationItem({
  notification,
}: CommentMentionNotificationItemProps) {
  return (
    <NotificationItem notification={notification} to={`/post/${notification.metadata.postId}`}>
      <span className='text-sm'>mentioned you in a comment</span>
    </NotificationItem>
  );
}
