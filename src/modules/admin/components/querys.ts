import { adminGetAllPostAPI, adminGetPostsByUserIdAPI, getPostCountAPI } from '@/apis/postApi';
import { adminGetAllUsersAPI, getUserCountAPI } from '@/apis/userApi';
import { IPaginationParamsType } from '@/lib/types/interfaces';
import { useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';

// --- Query Key Factories ---

type PaginationWithKeywords = IPaginationParamsType & { keywords: string };

export const adminQueryKeys = {
  posts: (params: PaginationWithKeywords) => ['admin-posts', params] as const,
  postsByUserId: (params: PaginationWithKeywords & { userId: UUID }) =>
    ['admin-posts', params] as const,
  users: (params: PaginationWithKeywords) => ['admin-users', params] as const,
  postCount: () => ['post-count'] as const,
  userCount: () => ['user-count'] as const,
};

// Backward-compatible exports
export const getAdminPostListQueryKey = ({ page, limit, keywords }: PaginationWithKeywords) =>
  adminQueryKeys.posts({ page, limit, keywords });

export const getAdminPostListByUserIdQueryKey = (
  params: PaginationWithKeywords & { userId: UUID },
) => adminQueryKeys.postsByUserId(params);

export const getAdminUserListQueryKey = ({ page, limit, keywords }: PaginationWithKeywords) =>
  adminQueryKeys.users({ page, limit, keywords });

// --- Query Hooks ---

export const useGetAdminPostListQuery = ({ page, limit, keywords }: PaginationWithKeywords) => {
  return useQuery({
    queryKey: adminQueryKeys.posts({ page, limit, keywords }),
    queryFn: () => adminGetAllPostAPI({ page, limit, keywords }),
  });
};

export const useGetAdminPostListByUserIdQuery = ({
  userId,
  limit,
  page,
  keywords,
}: PaginationWithKeywords & { userId: UUID }) => {
  return useQuery({
    queryKey: adminQueryKeys.postsByUserId({ userId, limit, page, keywords }),
    queryFn: () => adminGetPostsByUserIdAPI({ userId, limit, page, keywords }),
  });
};

export const useGetAdminUserListQuery = ({ page, limit, keywords }: PaginationWithKeywords) => {
  return useQuery({
    queryKey: adminQueryKeys.users({ page, limit, keywords }),
    queryFn: () => adminGetAllUsersAPI({ page, limit, keywords }),
  });
};

export const useGetPostCountQuery = () => {
  return useQuery({
    queryKey: adminQueryKeys.postCount(),
    queryFn: async () => {
      const { data } = await getPostCountAPI();
      return data;
    },
  });
};

export const useGetUserCountQuery = () => {
  return useQuery({
    queryKey: adminQueryKeys.userCount(),
    queryFn: async () => {
      const { data } = await getUserCountAPI();
      return data;
    },
  });
};
