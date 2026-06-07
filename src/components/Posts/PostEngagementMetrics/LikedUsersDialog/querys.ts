import { getLikedUsersAPI } from '@/apis/postApi';
import { IPaginationParamsType } from '@/lib/types/interfaces';
import { IReactionType } from '@/lib/reactions';
import { useInfiniteQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';

/**
 * Query key for a post's reaction list. `type` is part of the key so each
 * reaction tab (All / Like / Love / ...) keeps its own cache + pagination.
 */
export const getLikedUsersQueryKey = (postId: UUID, type?: IReactionType) => [
  'likes',
  { postId, type: type ?? 'ALL' },
];

export function useGetLikedUsers({
  postId,
  type,
  enabled,
}: {
  postId: UUID;
  type?: IReactionType;
  enabled?: boolean;
}) {
  const getLikedUsers = async ({ page = 1, limit = 10 }: IPaginationParamsType) => {
    try {
      const { data } = await getLikedUsersAPI({ postId, page, limit, type });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const query = useInfiniteQuery({
    queryKey: getLikedUsersQueryKey(postId, type),
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
