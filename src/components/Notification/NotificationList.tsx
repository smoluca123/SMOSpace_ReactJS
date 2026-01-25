import {
  FollowNotificationItem,
  LikePostNotificationItem,
  PostMentionNotificationItem,
  CommentMentionNotificationItem,
} from '@/components/Notification/EntityNotifications';
import CommentNotificationItem from '@/components/Notification/EntityNotifications/CommentNotificationItem';
import FriendRequestNotificationItem from '@/components/Notification/EntityNotifications/FriendRequestNotificationItem';
import {
  ILikePostNotificationType,
  INotificationType,
  IPostMentionNotificationType,
  ICommentMentionNotificationType,
  ICommentNotificationType,
} from '@/lib/types/interfaces';

interface IProps {
  notification: INotificationType;
}

export default function NotificationList({ notification }: IProps) {
  // Handle mention notifications
  // if (notification.type.type === 'POST_MENTION') {
  //   return (
  //     <PostMentionNotificationItem notification={notification as IPostMentionNotificationType} />
  //   );
  // }

  // if (notification.type.type === 'COMMENT_MENTION') {
  //   return (
  //     <CommentMentionNotificationItem
  //       notification={notification as ICommentMentionNotificationType}
  //     />
  //   );
  // }

  // Handle other notification types by entity type
  return (
    <>
      {/* Handle mention notifications */}
      {notification.type.type === 'POST_MENTION' && (
        <PostMentionNotificationItem notification={notification as IPostMentionNotificationType} />
      )}
      {notification.type.type === 'COMMENT_MENTION' && (
        <CommentMentionNotificationItem
          notification={notification as ICommentMentionNotificationType}
        />
      )}

      {/* Handle other notification types by entity type */}
      {notification.entityType === 'FOLLOW' && (
        <FollowNotificationItem notification={notification} />
      )}
      {notification.entityType === 'COMMENT' && (
        <CommentNotificationItem notification={notification as ICommentNotificationType} />
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
