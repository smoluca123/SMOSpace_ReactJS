import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import Post from '@/components/Posts/Post';
import PostsLoadingSkeleton from '@/components/Posts/PostLoadingSkeleton';
import { PostProvider } from '@/components/Posts/PostProvider';
import {
  IApiPaginationResponseWrapper,
  IPostDataWithLikedStatusType,
} from '@/lib/types/interfaces';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';

export default function PostList({
  infinitePostData,
  skipFirstPost = false,
}: {
  infinitePostData: UseInfiniteQueryResult<
    InfiniteData<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data'], unknown>,
    Error
  >;
  skipFirstPost?: boolean;
}) {
  const { data, fetchNextPage, hasNextPage, isFetching } = infinitePostData;
  return (
    <InfiniteScrollContainer isShowInViewElement={hasNextPage} onBottomReached={fetchNextPage}>
      <div className='space-y-6'>
        {data &&
          data.pages.map((page) =>
            page.items.map((post, index) =>
              skipFirstPost && index === 0 ? null : (
                <PostProvider post={post} key={post.id}>
                  <Post key={post.id} />
                </PostProvider>
              ),
            ),
          )}

        {isFetching && <PostsLoadingSkeleton />}
      </div>

      {!hasNextPage && (
        <p className='my-10 font-normal text-center text-muted-foreground/60'>
          No more posts to load!
        </p>
      )}
    </InfiniteScrollContainer>
  );
}
