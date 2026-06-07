import { useLikePostMutation } from '@/components/Posts/PostAction/Actions/mutations';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePostContext } from '@/hooks/usePostContext';
import { cn } from '@/lib/utils';
import { getReactionConfig, IReactionType, REACTIONS } from '@/lib/reactions';
import { ThumbsUp } from 'lucide-react';
import { useOptimistic, useRef, useState, useTransition } from 'react';

/**
 * Reaction button.
 *
 * - Click: toggles the user's current reaction (or LIKE if none yet).
 * - Hover (or long-press on touch): reveals the reaction picker so the user
 *   can pick a different emoji (Love / Haha / ...).
 *
 * The button stays optimistic so the UI feels instant; the server response
 * later overwrites the optimistic value via the cache update in the mutation
 * hook.
 */
export default function LikePost() {
  const { post } = usePostContext();
  const { mutateAsync: react } = useLikePostMutation();

  const [optimisticReaction, setOptimisticReaction] = useOptimistic<
    IReactionType | null,
    IReactionType | null
  >(post.myReaction ?? (post.isLiked ? 'LIKE' : null), (_state, next) => next);

  const [, startTransition] = useTransition();

  // Picker open/close coordination -----------------------------------------
  // We keep the picker open while the cursor is over either the trigger or
  // the content; a small delay before closing makes diagonal mouse moves
  // forgiving.
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

  // Reaction handlers ------------------------------------------------------
  const submit = (type: IReactionType) => {
    startTransition(async () => {
      // If user re-picks the same type, the server toggles it off; mirror
      // that locally so the optimistic state matches.
      const next = optimisticReaction === type ? null : type;
      setOptimisticReaction(next);
      try {
        await react({ postId: post.id, type });
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleClick = () => {
    // Click without picking acts on the current reaction (toggle off) or
    // creates a default LIKE.
    submit(optimisticReaction ?? 'LIKE');
  };

  const config = getReactionConfig(optimisticReaction);
  const isActive = !!optimisticReaction;

  return (
    <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn('flex gap-2 items-center', isActive && config.activeColor)}
          variant='ghost'
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
        >
          {isActive ? (
            <span className='text-base leading-none'>{config.emoji}</span>
          ) : (
            <ThumbsUp className='size-4' />
          )}
          {isActive ? config.label : 'Like'}
        </Button>
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
