import { cn } from '@/lib/utils';
import CommentItemLayout from '@/components/Posts/Comment/CommentItemLayout';
import useCommentContext from '@/hooks/useCommentContext';
import { CommentInput } from '@/components/Posts/Comment/CommentActions/CreateComment';
import { useGetComments } from '@/components/Posts/Comment/querys';
import CommentLoadingSkeletons from '@/components/Posts/Comment/CommentLoadingSkeletons';
import CommentProvider from '@/components/Posts/Comment/CommentProvider';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';

export default function CommentItem({
  level = 0,
  maxLevel = 2,
}: {
  level?: number;
  maxLevel?: number;
}) {
  const { comment, isShowReplyInput, isShowReplies, setIsShowReplyInput, setIsShowReplies } =
    useCommentContext();

  return (
    <div className='space-y-2'>
      {/* Main Comment Content */}
      <CommentItemLayout />

      {/* Nested Replies */}
      <NestedReplies level={level} maxLevel={maxLevel} />
      {/* <div className={cn('', { '~pl-2/4 md:~pl-4/8': level < maxLevel })}>
        <CommentList replyTo={comment.id} showComments={showReplies} />
      </div> */}

      {/* Reply Input */}
      {isShowReplyInput && (
        <CommentInput
          isShowReplies={isShowReplies}
          setIsShowReplies={setIsShowReplies}
          replyToCommentId={comment.id}
          setIsShowReplyInput={setIsShowReplyInput}
        />
      )}
    </div>
  );
}

function NestedReplies({ level, maxLevel }: { level: number; maxLevel: number }) {
  const { comment, isShowReplies } = useCommentContext();

  const {
    data: replies,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useGetComments({
    postId: comment.post.id,
    replyTo: comment.id,
    enabled: comment.repliesCount > 0 && isShowReplies,
  });

  if (!isShowReplies) return null;

  return (
    <div>
      <div className={cn('space-y-4', { '~pl-2/4 md:~pl-4/8': level < maxLevel })}>
        {/* Loading Skeletons */}
        {isFetching && <CommentLoadingSkeletons />}

        {/* Replies */}
        <InfiniteScrollContainer
          onBottomReached={fetchNextPage}
          isShowInViewElement={hasNextPage}
          className='space-y-4'
        >
          {replies &&
            replies.pages.map((page) =>
              page.items.map((reply) => (
                <CommentProvider comment={reply} key={reply.id}>
                  <CommentItem key={reply.id} level={level + 1} maxLevel={maxLevel} />
                </CommentProvider>
              )),
            )}
        </InfiniteScrollContainer>
      </div>
    </div>
  );
}
