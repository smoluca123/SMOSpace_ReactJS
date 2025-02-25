import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import CommentItem from '@/components/Posts/Comment/CommentItem';
import CommentLoadingSkeletons from '@/components/Posts/Comment/CommentLoadingSkeletons';
import CommentProvider from '@/components/Posts/Comment/CommentProvider';
import { useGetComments } from '@/components/Posts/Comment/querys';
import { usePostContext } from '@/hooks/usePostContext';
import { UUID } from 'crypto';

export default function CommentList({
  replyTo,
  showComments = true,
}: {
  replyTo?: UUID;
  showComments?: boolean;
}) {
  const { post } = usePostContext();
  const { data, isFetching, fetchNextPage, hasNextPage } = useGetComments({
    postId: post.id,
    replyTo,
    enabled: post.commentCount > 0,
  });

  const maxLevel = 2;

  if (!showComments) return null;
  return (
    <div className='max-h-[500px] overflow-y-auto'>
      {/* Loading Skeletons */}
      {isFetching && <CommentLoadingSkeletons />}

      {/* Comments */}
      {data && (
        <InfiniteScrollContainer
          onBottomReached={fetchNextPage}
          isShowInViewElement={hasNextPage}
          rootMargin='500px'
          className='space-y-4'
        >
          {data.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentProvider comment={comment} key={comment.id}>
                <CommentItem key={comment.id} level={comment.level} maxLevel={maxLevel} />
              </CommentProvider>
            ))}
        </InfiniteScrollContainer>
      )}

      {!data && !isFetching && <p className='text-center text-muted-foreground'>No comments yet</p>}
    </div>
  );
}
