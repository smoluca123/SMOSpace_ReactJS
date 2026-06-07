import { useToggleBookmarkMutation } from '@/components/Posts/PostAction/Actions/mutations';
import { Button } from '@/components/ui/button';
import { usePostContext } from '@/hooks/usePostContext';
import { cn } from '@/lib/utils';
import { Bookmark } from 'lucide-react';
import { AnimationControls, motion, useAnimationControls } from 'framer-motion';
import { useOptimistic, useTransition } from 'react';

export default function BookmarkPost() {
  const { post } = usePostContext();
  const { mutateAsync: toggleBookmark } = useToggleBookmarkMutation();
  const [optimisticIsBookmarked, addOptimistic] = useOptimistic<boolean, boolean>(
    !!post.isBookmarked,
    (state) => !state,
  );

  const [isPending, startTransition] = useTransition();

  const controls = useAnimationControls();

  const handleBookmark = () => {
    try {
      controls.start('click');
      startTransition(async () => {
        addOptimistic(!optimisticIsBookmarked);
        if (isPending) return;
        await toggleBookmark({ postId: post.id });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      className={cn('flex gap-2 items-center', {
        'text-primary hover:text-primary': optimisticIsBookmarked,
      })}
      variant='ghost'
      onClick={handleBookmark}
      onPointerDown={() => controls.start('tap')}
      onPointerUp={() => controls.start('initial')}
      onMouseEnter={() => controls.start('hover')}
      onMouseLeave={() => controls.start('initial')}
    >
      <BookmarkIcon controls={controls} isActive={optimisticIsBookmarked} />
      {optimisticIsBookmarked ? 'Saved' : 'Save'}
    </Button>
  );
}

function BookmarkIcon({ controls, isActive }: { controls: AnimationControls; isActive: boolean }) {
  return (
    <motion.div
      initial='initial'
      variants={{
        initial: { scale: 1 },
        tap: { scale: 0.8 },
        hover: { scale: 1.1 },
        click: { scale: [1, 1.2, 1], rotate: [0, 10, 0], transition: { duration: 0.4 } },
      }}
      animate={controls}
      transition={{ duration: 0.3 }}
    >
      <Bookmark className={cn('size-4', { 'fill-current': isActive })} />
    </motion.div>
  );
}
