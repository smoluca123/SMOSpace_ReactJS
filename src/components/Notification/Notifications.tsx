import { FollowNotificationItem } from '@/components/Notification/EntityNotifications';
import CommentNotificationItem from '@/components/Notification/EntityNotifications/CommentNotificationItem';
import { IApiPaginationResponseWrapper, INotificationType } from '@/lib/types/interfaces';
import { InfiniteData } from '@tanstack/react-query';

export default function Notifications({
  data,
}: {
  data: InfiniteData<IApiPaginationResponseWrapper<INotificationType>['data']>;
}) {
  return (
    <div>
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
                default:
                  return null;
              }
            }),
          )}
        {/* Loading */}
        {/* {isFetching && <Loader2 className='mx-auto animate-spin text-primary' />} */}
      </div>
    </div>
  );
}
