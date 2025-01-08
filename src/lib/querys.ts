import { getMyFollowersAPI, getMyInfomationAPI } from '@/apis/userApi';
import { IPaginationParamsType } from '@/lib/types/interfaces';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const getMyFollowersQueryKey = ['followers', 'me'];

export function useGetMyFollowersQuery() {
  const getMyFollowers = async ({ page, limit }: IPaginationParamsType) => {
    try {
      const { data } = await getMyFollowersAPI({ page, limit });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const query = useInfiniteQuery({
    queryKey: getMyFollowersQueryKey,
    queryFn: ({ pageParam }) => getMyFollowers({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined),
    getPreviousPageParam: (firstPage) =>
      firstPage.hasPreviousPage ? firstPage.currentPage - 1 : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialPageParam: 1,
  });
  return query;
}

export const getMyInfomationQueryKey = ['profile', 'me'];
export function useGetMyInfomation() {
  const getMyInfomation = async () => {
    try {
      const { data } = await getMyInfomationAPI();
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const query = useQuery({
    queryKey: getMyInfomationQueryKey,
    queryFn: getMyInfomation,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return query;
}
