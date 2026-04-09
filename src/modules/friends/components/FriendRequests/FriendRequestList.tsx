import { Link } from 'react-router-dom';
import FriendRequestItem from './FriendRequestItem';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import {
  IApiPaginationResponseWrapper,
  IFriendRequestWithFriendDataType,
} from '@/lib/types/interfaces';
import FriendRequestProvider from '@/modules/friends/components/FriendRequests/FriendRequestProvider';

export default function FriendRequestList({
  friendRequestsQuery,
}: {
  friendRequestsQuery: UseInfiniteQueryResult<
    InfiniteData<IApiPaginationResponseWrapper<IFriendRequestWithFriendDataType>['data'], unknown>,
    Error
  >;
}) {
  const { data, isPending } = friendRequestsQuery;

  return (
    <div className=''>
      {/* Friend request  List */}
      {data && !isPending && (
        <div className='grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'>
          {data.pages.flatMap((page) =>
            page.items.map((friendRequest) => (
              <FriendRequestProvider key={friendRequest.id} friendRequest={friendRequest}>
                <div className='pb-2 border-b last:border-none last:pb-0'>
                  <FriendRequestItem />
                </div>
              </FriendRequestProvider>
            )),
          )}
        </div>
      )}

      {!data || (data && data.pages[0].totalCount === 0 && !isPending && <EmptyRequest />)}
      {isPending && <RequestLoader />}
    </div>
  );
}

// Sub-components
const RequestLoader = () => {
  return (
    <div className='w-full my-2'>
      <Loader2 className='mx-auto animate-spin text-primary' />
    </div>
  );
};

const EmptyRequest = () => {
  return (
    <>
      {/* don't have request */}
      <div className='text-center'>
        <h1 className='my-5 text-base text-muted-foreground'>
          You don{"'"}t have any friend request !
        </h1>
      </div>
      <Link className='flex ml-3 gap-x-2 text-primary' to={'/'}>
        <ChevronLeft />
        Return to home page
      </Link>
    </>
  );
};
