import LikedUsersDialog from '@/components/Posts/PostEngagementMetrics/LikedUsersDialog';
import { usePostContext } from '@/hooks/usePostContext';
import { getReactionConfig, getTopReactions } from '@/lib/reactions';
import { ThumbsUp } from 'lucide-react';

/**
 * Engagement summary shown above the action bar.
 *
 * Renders the top reaction emojis (👍 ❤️ 😂 ...) followed by a count label
 * such as "You and 4 others". Falls back to the classic ThumbsUp when older
 * cached data has no `reactionCounts` yet.
 */
export default function LikeCounter() {
  const { post } = usePostContext();

  if (post.likeCount === 0) return null;

  const topReactions = getTopReactions(post.reactionCounts, 3);
  const myReaction = post.myReaction ?? (post.isLiked ? 'LIKE' : null);
  const myReactionLabel = myReaction ? getReactionConfig(myReaction).label : 'You';

  const countLabel = (() => {
    if (post.likeCount === 1 && myReaction) return 'You';
    const otherCount = myReaction ? post.likeCount - 1 : post.likeCount;
    if (myReaction) {
      return otherCount > 0 ? `You and ${otherCount} others` : 'You';
    }
    return `${otherCount}`;
  })();

  return (
    <div className='flex gap-2 items-center'>
      {/* Stacked emojis: top reaction types for this post */}
      <div className='flex items-center -space-x-1'>
        {topReactions.length > 0 ? (
          topReactions.map((reaction) => (
            <span
              key={reaction.type}
              className='inline-flex justify-center items-center w-5 h-5 text-sm rounded-full ring-2 ring-background bg-background'
              title={reaction.label}
            >
              {reaction.emoji}
            </span>
          ))
        ) : (
          // Older cached posts may not include reactionCounts yet
          <ThumbsUp className='text-primary' size={18} />
        )}
      </div>
      <LikedUsersDialog>
        <span
          className='text-base cursor-pointer text-muted-foreground hover:underline'
          title={myReaction ? `Your reaction: ${myReactionLabel}` : undefined}
        >
          {countLabel}
        </span>
      </LikedUsersDialog>
    </div>
  );
}
