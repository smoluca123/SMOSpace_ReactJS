import LikedUsersDialog from '@/components/Posts/PostEngagementMetrics/LikedUsersDialog';
import { usePostContext } from '@/hooks/usePostContext';
import { ThumbsUp } from 'lucide-react';

export default function LikeCounter() {
  const { post } = usePostContext();

  // Helper function to render like text
  const getLikeText = () => {
    if (post.likeCount === 0) return null;
    if (post.likeCount === 1 && post.isLiked) return 'Bạn';

    const otherLikes = post.isLiked ? post.likeCount - 1 : post.likeCount;
    if (post.isLiked) {
      return otherLikes > 0 ? `You and ${otherLikes} others` : 'You';
    }
    return `${otherLikes}`;
  };

  const likeText = getLikeText();
  if (!likeText) return null;
  return (
    <div className='flex items-center gap-2 text-primary'>
      <ThumbsUp size={18} />
      <LikedUsersDialog>
        <span className='text-base cursor-pointer text-muted-foreground hover:underline'>
          {likeText}
        </span>
      </LikedUsersDialog>
    </div>
  );
}
