import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import NotificationList from '@/components/Notification/NotificationList';
import { IApiPaginationResponseWrapper, INotificationType } from '@/lib/types/interfaces';
import { InfiniteData } from '@tanstack/react-query';

export default function Notifications({
  data,
  hasNextPage,
  fetchNextPage,
}: {
  data: InfiniteData<IApiPaginationResponseWrapper<INotificationType>['data']>;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}) {
  return (
    <InfiniteScrollContainer
      onBottomReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      isShowInViewElement={hasNextPage}
    >
      <div className='space-y-2 px-4 pb-2 max-h-[500px] overflow-auto '>
        {data &&
          data.pages.flatMap((pages) =>
            pages.items.map((notification) => {
              return <NotificationList notification={notification} key={notification.id} />;
            }),
          )}

        {/* Loading */}
        {/* {isFetching && <Loader2 className='mx-auto animate-spin text-primary' />} */}
      </div>
    </InfiniteScrollContainer>
  );
}
