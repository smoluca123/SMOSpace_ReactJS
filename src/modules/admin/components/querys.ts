import { adminGetAllPostAPI, adminGetPostsByUserIdAPI, getPostCountAPI } from '@/apis/postApi';
import { adminGetAllUsersAPI, getUserCountAPI } from '@/apis/userApi';
import { IPaginationParamsType } from '@/lib/types/interfaces';
import { useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const getAdminPostListQueryKey = ({
  page,
  limit,
  keywords,
}: IPaginationParamsType & { keywords: string }) => [
  'admin-posts',
  {
    keywords,
    limit,
    page,
  },
];

export const getAdminPostListByUserIdQueryKey = ({
  page,
  limit,
  keywords,
  userId,
}: IPaginationParamsType & { keywords: string; userId: UUID }) => [
  'admin-posts',
  {
    keywords,
    limit,
    page,
    userId,
  },
];

export const getAdminUserListQueryKey = ({
  page,
  limit,
  keywords,
}: IPaginationParamsType & { keywords: string }) => [
  'admin-users',
  {
    page,
    limit,
    keywords,
  },
];

export const useGetAdminPostListQuery = ({
  page,
  limit,
  keywords,
}: IPaginationParamsType & { keywords: string }) => {
  const handleGetAdminPosts = async () => {
    try {
      const data = await adminGetAllPostAPI({ page, limit, keywords });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const query = useQuery({
    queryKey: getAdminPostListQueryKey({
      page,
      limit,
      keywords,
    }),
    queryFn: () => handleGetAdminPosts(),
  });

  return query;
};

export const useGetAdminPostListByUserIdQuery = ({
  userId,
  limit,
  page,
  keywords,
}: IPaginationParamsType & {
  keywords: string;
  userId: UUID;
}) => {
  const handleGetPostListByUserId = async () => {
    try {
      const data = await adminGetPostsByUserIdAPI({
        userId,
        limit,
        page,
        keywords,
      });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const query = useQuery({
    queryKey: getAdminPostListByUserIdQueryKey({ userId, limit, page, keywords }),
    queryFn: handleGetPostListByUserId,
  });

  return query;
};

export const useGetAdminUserListQuery = ({
  page,
  limit,
  keywords,
}: IPaginationParamsType & { keywords: string }) => {
  const handleGetAdminUsers = async () => {
    try {
      const data = await adminGetAllUsersAPI({ page, limit, keywords });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const query = useQuery({
    queryKey: getAdminUserListQueryKey({
      page,
      limit,
      keywords,
    }),
    queryFn: () => handleGetAdminUsers(),
  });

  return query;
};

export const useGetPostCountQuery = () => {
  const handleGetPostCount = async () => {
    try {
      const { data } = await getPostCountAPI();
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const query = useQuery({
    queryKey: ['post-count'],
    queryFn: handleGetPostCount,
  });

  return query;
};

export const useGetUserCountQuery = () => {
  const handleGetUserCount = async () => {
    try {
      const { data } = await getUserCountAPI();
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const query = useQuery({
    queryKey: ['user-count'],
    queryFn: handleGetUserCount,
  });

  return query;
};
