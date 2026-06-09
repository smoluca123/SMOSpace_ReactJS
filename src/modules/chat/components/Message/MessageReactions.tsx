import { IChatMessageReactionDataType } from '@/apis/types/chat.interfaces';
import { getReactionConfig, IReactionType } from '@/lib/reactions';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface MessageReactionsProps {
  reactions: IChatMessageReactionDataType[] | undefined;
  currentUserId?: string;
  /** Aligns the chip toward the message bubble side. */
  isSender: boolean;
  onToggle?: (type: IReactionType) => void;
}

/**
 * Compact reaction summary shown under a message bubble (Messenger style):
 * one chip per reaction type with its count. The current user's own reaction
 * type is highlighted, and clicking a chip toggles that reaction off.
 */
export default function MessageReactions({
  reactions,
  currentUserId,
  isSender,
  onToggle,
}: MessageReactionsProps) {
  const grouped = useMemo(() => {
    const counts = new Map<IReactionType, number>();
    (reactions ?? []).forEach((r) => {
      counts.set(r.type, (counts.get(r.type) ?? 0) + 1);
    });
    // Preserve a stable, count-desc order
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [reactions]);

  if (grouped.length === 0) return null;

  const myReactionType = reactions?.find((r) => r.userId === currentUserId)?.type ?? null;
  const total = reactions?.length ?? 0;

  return (
    <div className={cn('flex flex-wrap gap-1 mt-1', isSender ? 'justify-end' : 'justify-start')}>
      {grouped.map(([type, count]) => {
        const config = getReactionConfig(type);
        const isMine = myReactionType === type;
        return (
          <button
            key={type}
            type='button'
            onClick={() => onToggle?.(type)}
            title={config.label}
            className={cn(
              'flex items-center gap-0.5 px-1.5 h-6 text-xs rounded-full border bg-card transition-colors hover:bg-muted',
              isMine && 'border-primary bg-primary/10',
            )}
          >
            <span className='text-sm leading-none'>{config.emoji}</span>
            {total > 1 && <span className='text-muted-foreground'>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
