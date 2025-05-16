import { getMyFriendRequestsAPI } from '@/apis/userApi';
import { IPaginationParamsType } from '@/lib/types/interfaces';
import { useInfiniteQuery } from '@tanstack/react-query';

export const getMyFriendRequestsQueryKey = ['friend-request', 'me'];

export function useGetMyFriendRequests() {
  const getMyFriendRequest = async ({ limit, page }: IPaginationParamsType) => {
    try {
      const { data } = await getMyFriendRequestsAPI({
        limit,
        page,
      });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const query = useInfiniteQuery({
    queryKey: getMyFriendRequestsQueryKey,
    queryFn: ({ pageParam }) => getMyFriendRequest({ page: pageParam }),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined),
    getPreviousPageParam: (firstPage) =>
      firstPage.hasPreviousPage ? firstPage.currentPage - 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return query;
}
