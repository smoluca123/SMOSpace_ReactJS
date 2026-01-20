import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import NotificationGroupItem from '@/components/Notification/NotificationGroupItem';
import { IApiPaginationResponseWrapper, IGroupedNotificationType } from '@/lib/types/interfaces';
import { InfiniteData } from '@tanstack/react-query';

interface GroupedNotificationsProps {
  data: InfiniteData<IApiPaginationResponseWrapper<IGroupedNotificationType>['data']>;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export default function GroupedNotifications({
  data,
  hasNextPage,
  fetchNextPage,
}: GroupedNotificationsProps) {
  return (
    <InfiniteScrollContainer
      onBottomReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      isShowInViewElement={hasNextPage}
    >
      <div className='space-y-2 px-4 pb-2 max-h-[500px] overflow-auto'>
        {data &&
          data.pages.flatMap((pages) =>
            pages.items.map((group) => {
              return <NotificationGroupItem group={group} key={group.groupKey} />;
            }),
          )}
      </div>
    </InfiniteScrollContainer>
  );
}
