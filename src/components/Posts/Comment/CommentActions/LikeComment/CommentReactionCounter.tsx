import useCommentContext from '@/hooks/useCommentContext';
import { getTopReactions } from '@/lib/reactions';

/**
 * Compact reaction-count chip rendered inline with the comment action row.
 * Mirrors `LikeCounter` for posts but tuned to fit next to "Like / Reply".
 *
 * Hidden when the comment has zero reactions.
 */
export default function CommentReactionCounter() {
  const { comment } = useCommentContext();
  const likeCount = comment.likeCount ?? 0;

  if (likeCount === 0) return null;

  const topReactions = getTopReactions(comment.reactionCounts, 3);

  return (
    <div
      className='flex gap-1 items-center text-xs text-muted-foreground'
      title={`${likeCount} reaction${likeCount === 1 ? '' : 's'}`}
    >
      <div className='flex items-center -space-x-1'>
        {topReactions.length > 0 ? (
          topReactions.map((reaction) => (
            <span
              key={reaction.type}
              className='inline-flex justify-center items-center w-4 h-4 text-[11px] rounded-full ring-1 ring-background bg-background'
            >
              {reaction.emoji}
            </span>
          ))
        ) : (
          <span className='inline-block text-[11px]'>👍</span>
        )}
      </div>
      <span>{likeCount}</span>
    </div>
  );
}
