import { changeNotificationStatusAPI } from '@/apis/notificationApi';
import { notificationsQueryKey } from '@/components/Notification/querys';
import { IApiPaginationResponseWrapper, INotificationType } from '@/lib/types/interfaces';
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
