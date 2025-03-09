import { getAllPostsAPI, getMyPostsAPI } from '@/apis/postApi';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const getPostsQueryKey = ({
  likeUserId,
  keywords,
  userId,
}: {
  likeUserId?: UUID;
  keywords?: string;
  userId?: UUID;
}): QueryKey => ['posts', 'for-you', { likeUserId, keywords, userId }];

export function useGetPosts(
  {
    likeUserId,
    keywords,
    userId,
  }: {
    likeUserId?: UUID;
    keywords?: string;
    userId?: UUID;
  },
  options?: {
    enabled?: boolean;
  },
) {
  const getPosts = async ({ page }: { page?: number }) => {
    try {
      const data = await getAllPostsAPI({ page, likeUserId, keywords, userId });
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
      userId,
    }),
    queryFn: ({ pageParam }) => getPosts({ page: pageParam }),
    maxPages: 5,
    getPreviousPageParam: ({ hasPreviousPage, currentPage }) =>
      hasPreviousPage ? currentPage - 1 : undefined,
    getNextPageParam: ({ hasNextPage, currentPage }) => (hasNextPage ? currentPage + 1 : undefined),
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    enabled: options?.enabled || true,
  });
  return query;
}

export const getMyPostsQueryKey = ({ keywords }: { keywords?: string }): QueryKey => [
  'posts',
  'my-posts',
  { keywords },
];

export function useGetMyPosts(
  { keywords }: { keywords?: string },
  options?: {
    enabled?: boolean;
  },
) {
  const getPosts = async ({ page }: { page?: number }) => {
    try {
      const data = await getMyPostsAPI({ page, keywords });
      return data.data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };
  const query = useInfiniteQuery({
    queryKey: getPostsQueryKey({
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
    enabled: options?.enabled || true,
  });
  return query;
}
