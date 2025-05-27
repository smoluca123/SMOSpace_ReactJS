import { getMyFriendsAPI, getUserFriendsAPI } from '@/apis/userApi';
import { useInfiniteQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const getMyFriendsQueryKey = () => ['friend-list', 'me'];

export const useGetMyFriendsQuery = () => {
  const getMyFriends = async ({ pageParam = 1 }) => {
    try {
      const { data } = await getMyFriendsAPI({ page: pageParam, limit: 10 });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };
  return useInfiniteQuery({
    queryKey: getMyFriendsQueryKey(),
    queryFn: ({ pageParam = 1 }) => getMyFriends({ pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.hasPreviousPage ? firstPage.currentPage - 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });
};

export const getUserFriendsQueryKey = (userId: UUID) => ['friend-list', userId];

export const useGetUserFriendsQuery = ({ userId }: { userId: UUID }) => {
  const getUserFriends = async ({ pageParam = 1 }) => {
    try {
      const { data } = await getUserFriendsAPI({
        page: pageParam,
        limit: 10,
        userId,
      });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };
  return useInfiniteQuery({
    queryKey: getUserFriendsQueryKey(userId),
    queryFn: ({ pageParam = 1 }) => getUserFriends({ pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.hasPreviousPage ? firstPage.currentPage - 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });
};
