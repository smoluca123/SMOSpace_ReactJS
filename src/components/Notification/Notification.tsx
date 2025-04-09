import RefreshButton from '../RefreshButton';
import { Loader2 } from 'lucide-react';
import Notifications from './Notifications';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { IApiPaginationResponseWrapper, INotificationType } from '@/lib/types/interfaces';

export default function Notification({
  query,
}: {
  query: UseInfiniteQueryResult<
    InfiniteData<IApiPaginationResponseWrapper<INotificationType>['data'], unknown>,
    Error
  >;
}) {
  const { data, isFetching, refetch, fetchNextPage, hasNextPage } = query;
  return (
    <div className='w-full'>
      {/* Notification header */}
      <NotificationHeader refetch={refetch} />

      {/* Notification loading */}
      {isFetching && <NotificationLoader />}

      {/* Display notification list */}

      {data && data.pages[0].items.length > 0 && !isFetching && (
        <Notifications data={data} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />
      )}

      {/* Empty notification */}
      {(!data || data.pages[0].items.length === 0) && !isFetching && <EmptyNotification />}
    </div>
  );
}

// Sub-components

const NotificationHeader = ({ refetch }: { refetch: () => void }) => {
  return (
    <div className='flex border-b-[1px] border-border px-4 py-[10px] items-center justify-between w-full '>
      <h1 className='text-lg font-bold'>Notifications</h1>
      <RefreshButton onClick={refetch} />
    </div>
  );
};

const NotificationLoader = () => {
  return (
    <div className='my-2 w-full'>
      <Loader2 className='mx-auto animate-spin text-primary' />
    </div>
  );
};

const EmptyNotification = () => {
  return (
    <div className='text-center'>
      <h1 className='my-5 text-sm text-muted-foreground'>You don{"'"}t have any notifications !</h1>
    </div>
  );
};
