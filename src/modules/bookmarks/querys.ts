import { getMyBookmarksAPI } from '@/apis/postApi';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';

export const getMyBookmarksQueryKey = (): QueryKey => ['bookmarks', 'me'];

export function useGetMyBookmarks() {
  const getMyBookmarks = async ({ page }: { page?: number }) => {
    try {
      const data = await getMyBookmarksAPI({ page, limit: 10 });
      return data.data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  return useInfiniteQuery({
    queryKey: getMyBookmarksQueryKey(),
    queryFn: ({ pageParam }) => getMyBookmarks({ page: pageParam }),
    getPreviousPageParam: ({ hasPreviousPage, currentPage }) =>
      hasPreviousPage ? currentPage - 1 : undefined,
    getNextPageParam: ({ hasNextPage, currentPage }) => (hasNextPage ? currentPage + 1 : undefined),
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });
}
