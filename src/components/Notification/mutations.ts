import { changeNotificationStatusAPI, markGroupAsReadAPI } from '@/apis/notificationApi';
import {
  groupedNotificationsQueryKey,
  notificationsQueryKey,
} from '@/components/Notification/querys';
import {
  IApiPaginationResponseWrapper,
  IGroupedNotificationType,
  INotificationType,
} from '@/lib/types/interfaces';
import { InfiniteData, useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

export const useChangeNotificationStatus = () => {
  const queryClient = useQueryClient();

  const changeNotificationStatus = async ({
    notificationId,
    isRead,
  }: {
    notificationId: string;
    isRead: boolean;
  }) => {
    try {
      const response = await changeNotificationStatusAPI({ notificationId, isRead });
      return response.data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['changeNotificationStatus'],
    mutationFn: changeNotificationStatus,
    onSuccess: (newData) => {
      const notificationQueryFilter = {
        queryKey: notificationsQueryKey,
      };

      queryClient.cancelQueries(notificationQueryFilter);
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<INotificationType>['data']>
      >(notificationQueryFilter, (data) => {
        if (!data) return;
        return {
          ...data,
          pages: data.pages.map((page) => {
            return {
              ...page,
              items: page.items.map((item) => {
                if (item.id === newData.id) {
                  return newData;
                }
                return item;
              }),
            };
          }),
        };
      });
    },
  });

  return mutation;
};

export const useMarkGroupAsRead = () => {
  const queryClient = useQueryClient();

  const markGroupAsRead = async ({
    notificationIds,
    isRead,
  }: {
    notificationIds: string[];
    isRead: boolean;
  }) => {
    try {
      const response = await markGroupAsReadAPI({ notificationIds, isRead });
      return { notificationIds, isRead, response };
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['markGroupAsRead'],
    mutationFn: markGroupAsRead,
    onSuccess: ({ notificationIds, isRead }) => {
      // Update grouped notifications cache
      const groupedQueryFilter = {
        queryKey: groupedNotificationsQueryKey,
      };

      queryClient.cancelQueries(groupedQueryFilter);
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<IGroupedNotificationType>['data']>
      >(groupedQueryFilter, (data) => {
        if (!data) return;
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            items: page.items.map((group) => {
              // Check if any notificationId in group matches
              const hasMatch = group.notificationIds.some((id) => notificationIds.includes(id));
              if (hasMatch) {
                return { ...group, isRead };
              }
              return group;
            }),
          })),
        };
      });

      // Also invalidate flat notifications
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
  });

  return mutation;
};
