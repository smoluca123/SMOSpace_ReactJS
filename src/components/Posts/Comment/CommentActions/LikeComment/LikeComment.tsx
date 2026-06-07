import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useCommentContext from '@/hooks/useCommentContext';
import { getReactionConfig, IReactionType, REACTIONS } from '@/lib/reactions';
import { cn } from '@/lib/utils';
import { useOptimistic, useRef, useState, useTransition } from 'react';
import { useLikeCommentMutation } from './mutations';

/**
 * Reaction button for a comment.
 *
 * Mirrors `LikePost` behavior:
 * - Click: toggle current reaction (or LIKE if none).
 * - Hover (or long-press on touch): open the picker to choose another emoji.
 *
 * The trigger is intentionally a compact text button so it fits next to the
 * existing "Reply" link in the comment action row.
 */
export default function LikeComment() {
  const { comment } = useCommentContext();
  const { mutateAsync: react } = useLikeCommentMutation();

  const initialReaction: IReactionType | null =
    comment.myReaction ?? (comment.isLiked ? 'LIKE' : null);

  const [optimisticReaction, setOptimisticReaction] = useOptimistic<
    IReactionType | null,
    IReactionType | null
  >(initialReaction, (_state, next) => next);

  const [, startTransition] = useTransition();

  // Picker open/close coordination - same forgiving hover pattern as LikePost.
  const [pickerOpen, setPickerOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setPickerOpen(false), 120);
  };

  // Long-press support for touch devices
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => setPickerOpen(true), 350);
  };
  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const submit = (type: IReactionType) => {
    startTransition(async () => {
      // Picking the same type toggles it off; mirror locally.
      const next = optimisticReaction === type ? null : type;
      setOptimisticReaction(next);
      try {
        await react({ commentId: comment.id, type });
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleClick = () => {
    submit(optimisticReaction ?? 'LIKE');
  };

  const config = getReactionConfig(optimisticReaction);
  const isActive = !!optimisticReaction;

  return (
    <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          onClick={handleClick}
          onMouseEnter={() => {
            cancelClose();
            setPickerOpen(true);
          }}
          onMouseLeave={scheduleClose}
          onTouchStart={startLongPress}
          onTouchEnd={cancelLongPress}
          onTouchCancel={cancelLongPress}
          aria-label={isActive ? `Reacted: ${config.label}` : 'React'}
          className={cn(
            'inline-flex gap-1 items-center font-medium hover:text-primary',
            isActive ? config.activeColor : 'text-muted-foreground',
          )}
        >
          {isActive ? (
            <>
              <span className='text-base leading-none'>{config.emoji}</span>
              <span>{config.label}</span>
            </>
          ) : (
            <span>Like</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side='top'
        align='start'
        sideOffset={6}
        className='flex gap-1 p-1 w-auto rounded-full border shadow-md'
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        {REACTIONS.map((reaction) => (
          <button
            key={reaction.type}
            type='button'
            title={reaction.label}
            aria-label={reaction.label}
            onClick={() => {
              submit(reaction.type);
              setPickerOpen(false);
            }}
            className={cn(
              'flex justify-center items-center w-9 h-9 text-xl rounded-full transition-transform hover:scale-125 hover:bg-muted',
              optimisticReaction === reaction.type && 'bg-muted scale-110',
            )}
          >
            {reaction.emoji}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
