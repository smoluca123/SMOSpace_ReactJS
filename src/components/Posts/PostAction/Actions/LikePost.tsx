import { useLikePostMutation } from '@/components/Posts/PostAction/Actions/mutations';
import { Button } from '@/components/ui/button';
import { usePostContext } from '@/hooks/usePostContext';
import { cn } from '@/lib/utils';
import { ThumbsUp } from 'lucide-react';
import { AnimationControls, motion, useAnimationControls } from 'framer-motion';

export default function LikePost() {
  const { post } = usePostContext();
  const { mutate: likePost } = useLikePostMutation();
  const controls = useAnimationControls();

  const handleLike = () => {
    likePost({ postId: post.id });
    controls.start('click');
  };

  return (
    <Button
      className={cn('flex items-center gap-2', {
        'text-primary hover:text-primary': post.isLiked,
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
