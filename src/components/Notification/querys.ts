import {
  getGroupedNotificationsAPI,
  getNotificationsAPI,
  IGetGroupedNotificationsParams,
} from '@/apis/notificationApi';
import { IPaginationParamsType } from '@/lib/types/interfaces';
import { useInfiniteQuery } from '@tanstack/react-query';

export const notificationsQueryKey = ['notifications'];
export const groupedNotificationsQueryKey = ['grouped-notifications'];

export function useGetNotifications(options?: { enabled?: boolean }) {
  const getNotifications = async ({ page, limit }: IPaginationParamsType) => {
    try {
      const data = await getNotificationsAPI({ page, limit });
      return data.data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const query = useInfiniteQuery({
    queryKey: notificationsQueryKey,
    queryFn: async ({ pageParam }) => await getNotifications({ page: pageParam }),
    getPreviousPageParam: ({ hasPreviousPage, currentPage }) =>
      hasPreviousPage ? currentPage - 1 : undefined,
    getNextPageParam: ({ hasNextPage, currentPage }) => (hasNextPage ? currentPage + 1 : undefined),
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    enabled: options?.enabled ?? true,
  });

  return query;
}

export function useGetGroupedNotifications(options?: { enabled?: boolean; groupByTime?: number }) {
  const getGroupedNotifications = async (params: IGetGroupedNotificationsParams) => {
    try {
      const data = await getGroupedNotificationsAPI(params);
      return data.data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const query = useInfiniteQuery({
    queryKey: [...groupedNotificationsQueryKey, options?.groupByTime ?? 24],
    queryFn: async ({ pageParam }) =>
      await getGroupedNotifications({
        page: pageParam,
        groupByTime: options?.groupByTime ?? 24,
      }),
    getPreviousPageParam: ({ hasPreviousPage, currentPage }) =>
      hasPreviousPage ? currentPage - 1 : undefined,
    getNextPageParam: ({ hasNextPage, currentPage }) => (hasNextPage ? currentPage + 1 : undefined),
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    enabled: options?.enabled ?? true,
  });

  return query;
}
