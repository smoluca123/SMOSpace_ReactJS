import { getAllPostsAPI } from '@/apis/postApi';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const getPostsQueryKey = ({
  likeUserId,
  keywords,
}: {
  likeUserId?: UUID;
  keywords?: string;
}): QueryKey => ['posts', 'for-you', { likeUserId, keywords }];

export function useGetPosts({ likeUserId, keywords }: { likeUserId?: UUID; keywords?: string }) {
  const getPosts = async ({ page }: { page?: number }) => {
    try {
      const data = await getAllPostsAPI({ page, likeUserId, keywords });
      return data.data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };
  const query = useInfiniteQuery({
    queryKey: getPostsQueryKey({
      likeUserId,
      keywords,
    }),
    queryFn: ({ pageParam }) => getPosts({ page: pageParam }),
    maxPages: 5,
    getPreviousPageParam: ({ hasPreviousPage, currentPage }) =>
      hasPreviousPage ? currentPage - 1 : undefined,
    getNextPageParam: ({ hasNextPage, currentPage }) => (hasNextPage ? currentPage + 1 : undefined),
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });
  return query;
}
