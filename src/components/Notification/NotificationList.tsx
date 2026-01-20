import {
  FollowNotificationItem,
  LikePostNotificationItem,
} from '@/components/Notification/EntityNotifications';
import CommentNotificationItem from '@/components/Notification/EntityNotifications/CommentNotificationItem';
import FriendRequestNotificationItem from '@/components/Notification/EntityNotifications/FriendRequestNotificationItem';
import { ILikePostNotificationType, INotificationType } from '@/lib/types/interfaces';

interface IProps {
  notification: INotificationType;
}

export default function NotificationList({ notification }: IProps) {
  return (
    <>
      {notification.entityType === 'FOLLOW' && (
        <FollowNotificationItem notification={notification} />
      )}
      {notification.entityType === 'COMMENT' && (
        <CommentNotificationItem notification={notification} />
      )}
      {notification.entityType === 'FRIENDSHIP' && (
        <FriendRequestNotificationItem notification={notification} />
      )}
      {notification.entityType === 'POST' && (
        <LikePostNotificationItem notification={notification as ILikePostNotificationType} />
      )}
    </>
  );
}
