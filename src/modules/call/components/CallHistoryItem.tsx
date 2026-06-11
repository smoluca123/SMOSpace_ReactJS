import UserAvatar from '@/components/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ICallHistoryItem } from '@/apis/types/call.interfaces';
import { formatCallDuration } from '@/modules/call/callMessage';
import { cn } from '@/lib/utils';
import {
  MicOff,
  Phone,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  Video,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface CallHistoryItemProps {
  item: ICallHistoryItem;
  /** ID of the current logged-in user (to label outgoing vs incoming). */
  currentUserId: string;
}

/** Icon + badge colour config keyed by status and call type. */
function CallTypeIcon({
  callType,
  status,
}: Pick<ICallHistoryItem, 'callType' | 'status'>) {
  const missed = status === 'missed';

  if (missed) {
    return (
      <div className='flex justify-center items-center w-10 h-10 rounded-full bg-destructive/10'>
        <PhoneMissed className='w-5 h-5 text-destructive' />
      </div>
    );
  }

  if (callType === 'video') {
    return (
      <div className='flex justify-center items-center w-10 h-10 rounded-full bg-blue-500/10'>
        <Video className='w-5 h-5 text-blue-500' />
      </div>
    );
  }

  return (
    <div className='flex justify-center items-center w-10 h-10 rounded-full bg-green-500/10'>
      <Phone className='w-5 h-5 text-green-500' />
    </div>
  );
}

/**
 * A single row in the call history list.
 * Shows: participant avatar + name, call type badge, status, duration, and
 * a "Call back" button that navigates to the chat room.
 */
export default function CallHistoryItem({ item, currentUserId: _ }: CallHistoryItemProps) {
  const navigate = useNavigate();
  const mainParticipant = item.participants[0];
  const extraCount = item.participants.length - 1;

  const displayName = mainParticipant
    ? mainParticipant.fullName || mainParticipant.username
    : item.roomName || 'Unknown';

  const timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });
  const isMissed = item.status === 'missed';

  const handleCallBack = () => {
    navigate(`/chat/${item.roomId}`);
  };

  return (
    <div
      id={`call-history-item-${item.messageId}`}
      className={cn(
        'flex gap-4 items-center p-4 rounded-xl border transition-colors hover:bg-muted/40',
        isMissed && 'border-destructive/20 bg-destructive/5',
      )}
    >
      {/* Participant avatar */}
      <div className='relative shrink-0'>
        {mainParticipant ? (
          <UserAvatar
            userId={mainParticipant.id}
            avatarUrl={mainParticipant.avatar ?? undefined}
            fallbackName={mainParticipant.fullName}
            className='w-12 h-12'
          />
        ) : (
          <div className='flex justify-center items-center w-12 h-12 rounded-full bg-muted'>
            <Phone className='w-5 h-5 text-muted-foreground' />
          </div>
        )}

        {/* Overlap badge for extra participants in group calls */}
        {extraCount > 0 && (
          <span className='flex absolute -bottom-1 -right-1 justify-center items-center w-5 h-5 text-[10px] font-bold rounded-full border-2 bg-background border-background text-foreground'>
            +{extraCount}
          </span>
        )}
      </div>

      {/* Main info */}
      <div className='flex-1 min-w-0'>
        <div className='flex gap-2 items-center'>
          <p
            className={cn(
              'font-semibold truncate',
              isMissed && 'text-destructive',
            )}
          >
            {displayName}
          </p>
          {/* Call type badge */}
          <Badge
            variant='outline'
            className='shrink-0 text-xs'
          >
            {item.callType === 'video' ? (
              <span className='flex gap-1 items-center'>
                <Video className='w-3 h-3' /> Video
              </span>
            ) : (
              <span className='flex gap-1 items-center'>
                <MicOff className='w-3 h-3' /> Audio
              </span>
            )}
          </Badge>
        </div>

        <div className='flex gap-2 items-center mt-0.5 text-sm text-muted-foreground'>
          {/* Status icon inline */}
          {isMissed ? (
            <PhoneMissed className='w-3.5 h-3.5 text-destructive' />
          ) : (
            <PhoneOff className='w-3.5 h-3.5 text-green-500' />
          )}
          <span className={isMissed ? 'text-destructive' : ''}>
            {isMissed ? 'Missed' : `Ended · ${formatCallDuration(item.duration)}`}
          </span>
          <span>·</span>
          <span>{timeAgo}</span>
        </div>
      </div>

      {/* Call type icon */}
      <CallTypeIcon callType={item.callType} status={item.status} />

      {/* Call back button */}
      <Button
        id={`call-history-callback-${item.messageId}`}
        variant='outline'
        size='sm'
        className='shrink-0 gap-1.5'
        onClick={handleCallBack}
        aria-label={`Open chat with ${displayName}`}
      >
        <PhoneIncoming className='w-4 h-4' />
        <span className='hidden sm:inline'>Chat</span>
      </Button>
    </div>
  );
}
