import {
  getAllUsersInfomationAPI,
  getUserFollowersAPI,
  getUserFollowingsAPI,
} from './../apis/userApi';
import { getMyFollowersAPI, getMyInfomationAPI, getUserInfomationAPI } from '@/apis/userApi';
import { IPaginationParamsType, IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useInfiniteQuery, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { UUID } from 'crypto';

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

export const getUserFollowersQueryKey = ({ userId }: { userId: UUID | string }) => [
  'followers',
  {
    userId,
  },
];

export function useGetUserFollowersQuery({ userId }: { userId: UUID | string }) {
  const getUserFollowers = async ({ page, limit }: IPaginationParamsType) => {
    try {
      const { data } = await getUserFollowersAPI({ userId, page, limit });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const query = useInfiniteQuery({
    queryKey: getUserFollowersQueryKey({ userId }),
    queryFn: ({ pageParam }) => getUserFollowers({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined),
    getPreviousPageParam: (firstPage) =>
      firstPage.hasPreviousPage ? firstPage.currentPage - 1 : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialPageParam: 1,
  });
  return query;
}

export const getUserFollowingsQueryKey = ({ userId }: { userId: UUID | string }) => [
  'followings',
  {
    userId,
  },
];

export function useGetUserFollowingsQuery({ userId }: { userId: UUID | string }) {
  const getUserFollowings = async ({ page, limit }: IPaginationParamsType) => {
    try {
      const { data } = await getUserFollowingsAPI({ userId, page, limit });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const query = useInfiniteQuery({
    queryKey: getUserFollowingsQueryKey({ userId }),
    queryFn: ({ pageParam }) => getUserFollowings({ page: pageParam, limit: 10 }),
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

export const getUserInfomationQueryKey = ({ userId }: { userId: UUID | string }) => [
  'profile',
  {
    userId,
  },
];

export function useGetUserInfomation(
  { userId, followerId }: { userId: UUID | string; followerId?: UUID },
  options?: Omit<UseQueryOptions<IUserDataWithFollowedStatusType>, 'queryKey' | 'queryFn'>,
) {
  const { user } = useAppSelector(selectAuth);

  const getUserInfomation = async () => {
    try {
      const { data } = await getUserInfomationAPI({
        userId,
        followerId: followerId || user?.id,
      });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const query = useQuery({
    queryKey: getUserInfomationQueryKey({ userId }),
    queryFn: getUserInfomation,
    ...options,
  });

  return query;
}

export const getAllUsersInfomationQueryKey = ({ keywords }: { keywords: string }) => [
  'users',
  { keywords },
];

export function useGetAllUsersInfomation({ keywords }: { keywords: string }) {
  const { user } = useAppSelector(selectAuth);
  const followerId = user?.id;

  const getAllUsersInfomation = async ({ page }: { page: number }) => {
    try {
      const { data } = await getAllUsersInfomationAPI({ page, keywords, followerId });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const query = useInfiniteQuery({
    queryKey: getAllUsersInfomationQueryKey({ keywords }),
    queryFn: ({ pageParam }) => getAllUsersInfomation({ page: pageParam }),
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
