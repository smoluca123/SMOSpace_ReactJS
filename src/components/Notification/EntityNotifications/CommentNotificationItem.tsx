import NotificationItem from '@/components/Notification/NotificationItem';
import { ICommentNotificationType } from '@/lib/types/interfaces';

interface CommentNotificationItemProps {
  notification: ICommentNotificationType;
}

export default function CommentNotificationItem({ notification }: CommentNotificationItemProps) {
  switch (notification.type.type) {
    case 'REPLY_COMMENT':
      return (
        <NotificationItem notification={notification} to={`/posts/${notification.metadata.postId}`}>
          <span>replied to your comment</span>
        </NotificationItem>
      );
    case 'COMMENT_POST':
      return (
        <NotificationItem notification={notification} to={`/posts/${notification.metadata.postId}`}>
          <span>commented on your post</span>
        </NotificationItem>
      );
    default:
      return null;
  }
}
