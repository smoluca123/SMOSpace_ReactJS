import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import { useGetAllUsersInfomation } from '@/lib/querys';
import { useSearchParams } from 'react-router-dom';
import UserItem from './UserItem';
import UserItemSkeleton from './UserItemSkeleton';

export default function SearchUserContent() {
  const [URLSearchParams] = useSearchParams();

  const searchContent = decodeURI(URLSearchParams.get('q') || '');

  const { data, hasNextPage, fetchNextPage, isFetching } = useGetAllUsersInfomation({
    keywords: searchContent,
  });

  return (
    <InfiniteScrollContainer isShowInViewElement={hasNextPage} onBottomReached={fetchNextPage}>
      {/* User list */}
      <div className='grid gap-4 px-6 sm:px-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 2xl:grid-cols-4'>
        {data &&
          data.pages.map((page) =>
            page.items.map((user, index) => <UserItem user={user} key={index} />),
          )}
      </div>

      {/* Loading */}
      {isFetching && <LoaderSkeletion />}

      {/* Empty */}
      {!hasNextPage && (
        <p className='my-10 font-normal text-center text-muted-foreground/60'>
          No more posts to load!
        </p>
      )}
    </InfiniteScrollContainer>
  );
}

function LoaderSkeletion() {
  return (
    <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 2xl:grid-cols-4'>
      {Array.from({ length: 10 }, (_, i) => (
        <UserItemSkeleton key={Math.random() * i} />
      ))}
    </div>
  );
}
