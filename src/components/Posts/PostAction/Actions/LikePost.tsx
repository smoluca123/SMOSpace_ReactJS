import { useLikePostMutation } from '@/components/Posts/PostAction/Actions/mutations';
import { Button } from '@/components/ui/button';
import { usePostContext } from '@/hooks/usePostContext';
import { cn } from '@/lib/utils';
import { ThumbsUp } from 'lucide-react';
import { AnimationControls, motion, useAnimationControls } from 'framer-motion';
import { useEffect, useOptimistic, useTransition } from 'react';

export default function LikePost() {
  const { post } = usePostContext();
  const { mutateAsync: likePost } = useLikePostMutation();
  const [optimisticIsLiked, addOptimistic] = useOptimistic<boolean, boolean>(
    post.isLiked,
    (state) => !state,
  );

  const [isPending, startTransition] = useTransition();

  const controls = useAnimationControls();

  const handleLike = () => {
    try {
      controls.start('click');
      startTransition(async () => {
        addOptimistic(!optimisticIsLiked);
        if (isPending) return;
        await likePost({ postId: post.id });
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log('optimisticIsLiked', optimisticIsLiked);
  }, [optimisticIsLiked]);
  return (
    <Button
      className={cn('flex gap-2 items-center', {
        'text-primary hover:text-primary': optimisticIsLiked,
      })}
      variant='ghost'
      onClick={handleLike}
      onPointerDown={() => controls.start('tap')}
      onPointerUp={() => controls.start('initial')}
      onMouseEnter={() => controls.start('hover')}
      onMouseLeave={() => controls.start('initial')}
    >
      <LikePostIcon controls={controls} />
      Like
    </Button>
  );
}

function LikePostIcon({ controls }: { controls: AnimationControls }) {
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
      <ThumbsUp className='size-4' />
    </motion.div>
  );
}
