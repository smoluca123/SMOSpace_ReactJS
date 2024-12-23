import { getAllPostsAPI } from '@/apis/postApi';
import { useInfiniteQuery } from '@tanstack/react-query';

export const getPostsQueryKey = ['posts', 'for-you'];

export function useGetPosts() {
  const getPosts = async ({ page }: { page?: number }) => {
    try {
      const data = await getAllPostsAPI({ page });
      return data.data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };
  const query = useInfiniteQuery({
    queryKey: getPostsQueryKey,
    queryFn: ({ pageParam }) => getPosts({ page: pageParam }),
    maxPages: 5,
    getPreviousPageParam: ({ hasPreviousPage, currentPage }) =>
      hasPreviousPage ? currentPage - 1 : undefined,
    getNextPageParam: ({ hasNextPage, currentPage }) => (hasNextPage ? currentPage + 1 : undefined),
    initialPageParam: 1,
  });
  return query;
}
