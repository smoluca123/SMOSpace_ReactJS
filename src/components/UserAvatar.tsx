import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import avatarPlaceholder from '@/assets/imgs/avatar-placeholder.png';
import { useAppSelector } from '@/redux/hooks';
import { selectUserStatus } from '@/redux/slices/presenceSlice';
import { UserPresenceStatus } from '@/lib/sockets';

interface IProps extends PropsWithClassName {
  fallbackName?: string;
  avatarUrl?: string;
  /**
   * When provided, the avatar shows a realtime online status indicator for this
   * user. Leave undefined to render a plain avatar (e.g. placeholders).
   */
  userId?: string;
  /** Force-hide the status indicator even when a userId is given. */
  showStatus?: boolean;
}

const statusColor: Record<Exclude<UserPresenceStatus, 'offline'>, string> = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

export default function UserAvatar({
  avatarUrl,
  fallbackName = 'Anonymous',
  className,
  userId,
  showStatus = true,
}: IProps) {
  const status = useAppSelector(selectUserStatus(userId));
  const shouldShowStatus = Boolean(userId) && showStatus && status !== 'offline';

  return (
    // The wrapper carries the layout className (size/margins) so existing call
    // sites keep their sizing, while letting the status dot escape the Avatar's
    // `overflow-hidden` clipping.
    <div className={cn('relative inline-flex shrink-0 size-10', className)}>
      <Avatar className='size-full'>
        <AvatarFallback>{fallbackName[0].toLocaleUpperCase()}</AvatarFallback>
        <AvatarImage
          className='object-cover'
          src={avatarUrl || avatarPlaceholder}
          alt={fallbackName}
        />
      </Avatar>
      {shouldShowStatus && (
        <span
          aria-label={`User is ${status}`}
          className={cn(
            'absolute bottom-0 right-0 z-10 block size-3 rounded-full ring-2 ring-background',
            statusColor[status as Exclude<UserPresenceStatus, 'offline'>],
          )}
        />
      )}
    </div>
  );
}
