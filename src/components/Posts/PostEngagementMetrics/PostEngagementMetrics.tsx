import { LikeCounter } from '@/components/Posts/PostEngagementMetrics';
import { usePostContext } from '@/hooks/usePostContext';

export default function PostEngagementMetrics() {
  const { post } = usePostContext();
  const shareCount = post.shareCount ?? 0;
  const commentCount = post.commentCount ?? 0;

  return (
    <div className='flex gap-2 justify-between items-center'>
      {/* Like counter */}
      <LikeCounter />

      {/* Comment + share counts */}
      <div className='flex gap-3 items-center text-sm text-muted-foreground'>
        {commentCount > 0 && (
          <span>
            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </span>
        )}
        {shareCount > 0 && (
          <span>
            {shareCount} {shareCount === 1 ? 'share' : 'shares'}
          </span>
        )}
      </div>
    </div>
  );
}
