import { getLikedUsersAPI } from '@/apis/postApi';
import { IPaginationParamsType } from '@/lib/types/interfaces';
import { useInfiniteQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const getLikedUsersQueryKey = (postId: UUID) => ['likes', { postId }];
export function useGetLikedUsers({ postId, enabled }: { postId: UUID; enabled?: boolean }) {
  const getLikedUsers = async ({ page = 1, limit = 10 }: IPaginationParamsType) => {
    try {
      const { data } = await getLikedUsersAPI({ postId, page, limit });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const query = useInfiniteQuery({
    queryKey: getLikedUsersQueryKey(postId),
    queryFn: ({ pageParam = 1 }) => getLikedUsers({ page: pageParam }),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage && lastPage.currentPage + 1) || undefined,
    getPreviousPageParam: (firstPage) =>
      (firstPage.hasPreviousPage && firstPage.currentPage - 1) || undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    enabled,
  });
  return query;
}
