import { getNotificationsAPI } from '@/apis/notificationApi';
import { IPaginationParamsType } from '@/lib/types/interfaces';
import { useInfiniteQuery } from '@tanstack/react-query';

export const notificationsQueryKey = ['notifications'];

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
