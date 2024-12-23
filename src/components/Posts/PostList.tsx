import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import Post from '@/components/Posts/Post';
import PostsLoadingSkeleton from '@/components/Posts/PostLoadingSkeleton';
import { IApiPaginationResponseWrapper, IPostDataType } from '@/lib/types/interfaces';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';

export default function PostList({
  infinitePostData,
}: {
  infinitePostData: UseInfiniteQueryResult<
    InfiniteData<IApiPaginationResponseWrapper<IPostDataType>['data'], unknown>,
    Error
  >;
}) {
  const { data, fetchNextPage, hasNextPage, isFetching } = infinitePostData;
  return (
    <InfiniteScrollContainer isShowInViewElement={hasNextPage} onBottomReached={fetchNextPage}>
      <div className='space-y-6'>
        {data &&
          data.pages.map((page) => page.items.map((post) => <Post key={post.id} post={post} />))}

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
