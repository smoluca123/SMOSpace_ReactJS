import { adminGetAllPostAPI } from '@/apis/postApi';
import { getAllUsersInfomationAPI } from '@/apis/userApi';
import { IPaginationParamsType } from '@/lib/types/interfaces';
import { useQuery } from '@tanstack/react-query';

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

export const useGetAdminUserListQuery = ({
  page,
  limit,
  keywords,
}: IPaginationParamsType & { keywords: string }) => {
  const handleGetAdminUsers = async () => {
    try {
      const data = await getAllUsersInfomationAPI({ page, limit, keywords });
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
