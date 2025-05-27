import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import { FollowNotificationItem } from '@/components/Notification/EntityNotifications';
import CommentNotificationItem from '@/components/Notification/EntityNotifications/CommentNotificationItem';
import FriendRequestNotificationItem from '@/components/Notification/EntityNotifications/FriendRequestNotificationItem';
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
              switch (notification.entityType) {
                case 'FOLLOW':
                  return (
                    <FollowNotificationItem notification={notification} key={notification.id} />
                  );
                case 'COMMENT':
                  return (
                    <CommentNotificationItem notification={notification} key={notification.id} />
                  );
                case 'FRIENDSHIP':
                  return (
                    <FriendRequestNotificationItem
                      notification={notification}
                      key={notification.id}
                    />
                  );
                default:
                  return null;
              }
            }),
          )}
        {/* Loading */}
        {/* {isFetching && <Loader2 className='mx-auto animate-spin text-primary' />} */}
      </div>
    </InfiniteScrollContainer>
  );
}
