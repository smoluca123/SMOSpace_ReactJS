import { getAllPostsAPI } from '@/apis/postApi';
import { useInfiniteQuery } from '@tanstack/react-query';

export const getPostsQueryKey = ['posts', 'for-you'];

export function useGetPosts() {
  const getPosts = async () => {
    try {
      const data = await getAllPostsAPI({});
      return data.data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };
  const query = useInfiniteQuery({
    queryKey: getPostsQueryKey,
    queryFn: getPosts,
    maxPages: 5,
    getPreviousPageParam: ({ hasPreviousPage, currentPage }) => hasPreviousPage && currentPage - 1,
    getNextPageParam: ({ hasNextPage, currentPage }) => hasNextPage && currentPage + 1,
    initialPageParam: 1,
  });
  return query;
}
