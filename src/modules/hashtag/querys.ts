import { getPostsByHashtagAPI } from '@/apis/postApi';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const getHashtagPostsQueryKey = (tag: string): QueryKey => ['posts', 'hashtag', tag];

export function useGetHashtagPosts({ tag, likeUserId }: { tag: string; likeUserId?: UUID }) {
  const getPosts = async ({ page }: { page?: number }) => {
    const data = await getPostsByHashtagAPI({ tag, page, likeUserId });
    return data.data;
  };

  return useInfiniteQuery({
    queryKey: getHashtagPostsQueryKey(tag),
    queryFn: ({ pageParam }) => getPosts({ page: pageParam }),
    getPreviousPageParam: ({ hasPreviousPage, currentPage }) =>
      hasPreviousPage ? currentPage - 1 : undefined,
    getNextPageParam: ({ hasNextPage, currentPage }) => (hasNextPage ? currentPage + 1 : undefined),
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!tag,
  });
}
