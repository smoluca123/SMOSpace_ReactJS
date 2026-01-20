import RefreshButton from '../RefreshButton';
import { Loader2, List, Layers } from 'lucide-react';
import Notifications from './Notifications';
import GroupedNotifications from './GroupedNotifications';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import {
  IApiPaginationResponseWrapper,
  IGroupedNotificationType,
  INotificationType,
} from '@/lib/types/interfaces';

type NotificationViewMode = 'flat' | 'grouped';

interface NotificationProps {
  flatQuery: UseInfiniteQueryResult<
    InfiniteData<IApiPaginationResponseWrapper<INotificationType>['data'], unknown>,
    Error
  >;
  groupedQuery: UseInfiniteQueryResult<
    InfiniteData<IApiPaginationResponseWrapper<IGroupedNotificationType>['data'], unknown>,
    Error
  >;
  viewMode: NotificationViewMode;
  onViewModeChange: (mode: NotificationViewMode) => void;
}

export default function Notification({
  flatQuery,
  groupedQuery,
  viewMode,
  onViewModeChange,
}: NotificationProps) {
  const currentQuery = viewMode === 'flat' ? flatQuery : groupedQuery;
  const { isFetching, refetch } = currentQuery;

  return (
    <div className='w-full'>
      {/* Notification header */}
      <NotificationHeader
        refetch={refetch}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      {/* Notification loading */}
      {isFetching && <NotificationLoader />}

      {/* Display notification list based on view mode */}
      {viewMode === 'flat' && (
        <>
          {flatQuery.data && flatQuery.data.pages[0].items.length > 0 && !flatQuery.isFetching && (
            <Notifications
              data={flatQuery.data}
              hasNextPage={flatQuery.hasNextPage}
              fetchNextPage={flatQuery.fetchNextPage}
            />
          )}
          {(!flatQuery.data || flatQuery.data.pages[0].items.length === 0) &&
            !flatQuery.isFetching && <EmptyNotification />}
        </>
      )}

      {viewMode === 'grouped' && (
        <>
          {groupedQuery.data &&
            groupedQuery.data.pages[0].items.length > 0 &&
            !groupedQuery.isFetching && (
              <GroupedNotifications
                data={groupedQuery.data}
                hasNextPage={groupedQuery.hasNextPage}
                fetchNextPage={groupedQuery.fetchNextPage}
              />
            )}
          {(!groupedQuery.data || groupedQuery.data.pages[0].items.length === 0) &&
            !groupedQuery.isFetching && <EmptyNotification />}
        </>
      )}
    </div>
  );
}

// Sub-components

interface NotificationHeaderProps {
  refetch: () => void;
  viewMode: NotificationViewMode;
  onViewModeChange: (mode: NotificationViewMode) => void;
}

const NotificationHeader = ({ refetch, viewMode, onViewModeChange }: NotificationHeaderProps) => {
  return (
    <div className='flex border-b-[1px] border-border px-4 py-[10px] items-center justify-between w-full'>
      <h1 className='text-lg font-bold'>Notifications</h1>
      <div className='flex items-center gap-2'>
        {/* View mode toggle */}
        <div className='flex items-center gap-1 bg-muted rounded-md p-0.5 overflow-hidden'>
          <button
            onClick={() => onViewModeChange('flat')}
            className={`p-1.5 rounded-full transition-colors ${
              viewMode === 'flat'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title='List view'
          >
            <List className='w-4 h-4' />
          </button>
          <button
            onClick={() => onViewModeChange('grouped')}
            className={`p-1.5 rounded-full transition-colors ${
              viewMode === 'grouped'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title='Grouped view'
          >
            <Layers className='w-4 h-4' />
          </button>
        </div>
        <RefreshButton onClick={refetch} />
      </div>
    </div>
  );
};

const NotificationLoader = () => {
  return (
    <div className='w-full my-2'>
      <Loader2 className='mx-auto animate-spin text-primary' />
    </div>
  );
};

const EmptyNotification = () => {
  return (
    <div className='text-center'>
      <h1 className='my-5 text-sm text-muted-foreground'>You don{"'"}t have any notifications!</h1>
    </div>
  );
};
