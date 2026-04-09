import { PopoverClose } from '@radix-ui/react-popover';
import { IGroupedNotificationType } from '@/lib/types/interfaces';
import useTimeDistance from '@/hooks/useTimeDistance';
import { useNavigate } from 'react-router-dom';
import NotificationDot from '@/components/Notification/NotificationDot';
import { useMarkGroupAsRead } from '@/components/Notification/mutations';
import UserAvatar from '@/components/UserAvatar';

interface NotificationGroupItemProps {
  group: IGroupedNotificationType;
}

/**
 * Render stacked avatars for multiple senders
 */
function StackedAvatars({
  senders,
  count,
}: {
  senders: IGroupedNotificationType['senders'];
  count: number;
}) {
  const displaySenders = senders.slice(0, 3);
  const extraCount = count - displaySenders.length;

  return (
    <div className='relative flex items-center'>
      {displaySenders.map((sender, index) => (
        <div
          key={sender.id}
          className='relative border-2 border-background rounded-full'
          style={{
            marginLeft: index > 0 ? '-12px' : 0,
            zIndex: displaySenders.length - index,
          }}
        >
          <UserAvatar
            avatarUrl={sender.avatar ?? undefined}
            fallbackName={sender.fullName}
            className='w-8 h-8'
          />
        </div>
      ))}
      {extraCount > 0 && (
        <div
          className='relative flex items-center justify-center w-8 h-8 text-xs font-medium bg-muted text-muted-foreground rounded-full border-2 border-background'
          style={{ marginLeft: '-12px', zIndex: 0 }}
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
}

/**
 * Get navigation path based on notification type
 */
function getNavigationPath(group: IGroupedNotificationType): string {
  const { entityType, metadata } = group;

  switch (entityType) {
    case 'COMMENT':
    case 'POST':
      return metadata?.postId ? `/post/${metadata.postId}` : '/';
    case 'FOLLOW':
      return group.senders[0]?.username ? `/${group.senders[0].username}` : '/';
    case 'FRIENDSHIP':
      return group.senders[0]?.username ? `/${group.senders[0].username}` : '/';
    default:
      return '/';
  }
}

export default function NotificationGroupItem({ group }: NotificationGroupItemProps) {
  const timeDistance = useTimeDistance({ dateString: group.createdAt });
  const { mutateAsync: markGroupAsRead } = useMarkGroupAsRead();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!group.isRead) {
      markGroupAsRead({
        notificationIds: group.notificationIds,
        isRead: true,
      });
    }
    navigate(getNavigationPath(group));
  };

  return (
    <PopoverClose className='w-full'>
      <div
        onClick={handleClick}
        className='flex relative gap-4 items-center p-3 w-full text-left rounded-sm transition-colors duration-300 cursor-pointer hover:bg-accent'
      >
        {/* Stacked Avatars */}
        <StackedAvatars senders={group.senders} count={group.count} />

        {/* Notification content */}
        <div className='flex-1'>
          <div className='gap-3 justify-between items-center md:flex'>
            <div className='line-clamp-3'>
              <span className='text-sm'>{group.content.message}</span>
            </div>
          </div>
          <div className='flex items-center gap-2 mt-1'>
            <p className='text-sm text-primary'>{timeDistance}</p>
            {group.count > 1 && (
              <span className='text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full'>
                {group.count}
              </span>
            )}
          </div>
        </div>

        {/* Unread dot */}
        {!group.isRead && <NotificationDot />}
      </div>
    </PopoverClose>
  );
}
