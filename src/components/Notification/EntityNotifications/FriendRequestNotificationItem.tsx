import NotificationItem from '@/components/Notification/NotificationItem';
import { IFriendRequestNotificationType } from '@/lib/types/interfaces';

interface FriendRequestNotificationItemProps {
  notification: IFriendRequestNotificationType;
}

export default function FriendRequestNotificationItem({
  notification,
}: FriendRequestNotificationItemProps) {
  switch (notification.type.type) {
    case 'FRIEND_REQUEST':
      return (
        <NotificationItem
          notification={notification}
          to={`/profile/${notification.metadata.friend.username}`}
        >
          <span>sent you a friend request</span>
        </NotificationItem>
      );
    default:
      return null;
  }
}
