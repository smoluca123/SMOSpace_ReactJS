import { adminDeletePostAPI, adminDeletePostsAPI, adminEditPostAPI } from '@/apis/postApi';
import { IUpdateInfomationType } from '@/apis/types/interfaces';
import {
  adminCreateUserAPI,
  adminToggleBanUserAPI,
  adminToggleBanUsers,
  adminUpdateUserInfomationAPI,
} from '@/apis/userApi';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import { AdminCreateUserType } from '@/lib/validations';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

// --- Helpers ---

const POST_QUERY_KEYS = ['admin-posts', 'post-count'] as const;
const USER_QUERY_KEYS = ['admin-users', 'user-count'] as const;

function useInvalidateQueries(keys: readonly string[]) {
  const queryClient = useQueryClient();
  return () => {
    keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
  };
}

// --- Post Mutations ---

export const useAdminDeletePostMutation = () => {
  const invalidatePosts = useInvalidateQueries(POST_QUERY_KEYS);

  return useMutation({
    mutationKey: ['admin-delete-post'],
    mutationFn: ({ postId }: { postId: UUID }) => adminDeletePostAPI({ postId }),
    onSuccess: invalidatePosts,
  });
};

export const useAdminEditPostMutation = () => {
  const invalidatePosts = useInvalidateQueries(POST_QUERY_KEYS);

  return useMutation({
    mutationKey: ['admin-edit-post'],
    mutationFn: (params: { postId: UUID; content: string; isPrivate: boolean; authorId: UUID }) =>
      adminEditPostAPI(params),
    onSuccess: invalidatePosts,
  });
};

export const useAdminDeletePostsMutation = () => {
  const invalidatePosts = useInvalidateQueries(POST_QUERY_KEYS);

  return useMutation({
    mutationKey: ['admin-delete-posts'],
    mutationFn: (postsId: string[]) => adminDeletePostsAPI(postsId),
    onSuccess: invalidatePosts,
  });
};

// --- User Mutations ---

export const useAdminToggleBanUserMutation = () => {
  const invalidateUsers = useInvalidateQueries(USER_QUERY_KEYS);

  return useMutation({
    mutationKey: ['admin-toggle-ban-user'],
    mutationFn: async ({ userId, isBanned }: { userId: UUID; isBanned: boolean }) => {
      const { data } = await adminToggleBanUserAPI({ userId, isBanned });
      return data;
    },
    onSuccess: invalidateUsers,
  });
};

export const useAdminUpdateUserInfoMutation = ({ userId }: { userId: UUID }) => {
  const { user } = useAppSelector(selectAuth);
  const queryClient = useQueryClient();
  const isMe = user?.id === userId;
  const { update } = useUpdateDataInfomation();

  return useMutation({
    mutationKey: ['admin-update-user-information', userId],
    mutationFn: async (newUserData: IUpdateInfomationType) => {
      const { data } = await adminUpdateUserInfomationAPI({ userId, newUserData });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      if (isMe && user) {
        update({ ...user, data });
      }
    },
  });
};

export const useAdminToggleBanUsersMutation = () => {
  const invalidateUsers = useInvalidateQueries(USER_QUERY_KEYS);

  return useMutation({
    mutationKey: ['admin-toggle-ban-users'],
    mutationFn: (banList: { userId: UUID; isBanned: boolean }[]) => adminToggleBanUsers(banList),
    onSuccess: invalidateUsers,
  });
};

export const useAdminCreateUserMutation = () => {
  const invalidateUsers = useInvalidateQueries(USER_QUERY_KEYS);

  return useMutation({
    mutationKey: ['admin-create-user'],
    mutationFn: async (credentials: AdminCreateUserType) => {
      const { data } = await adminCreateUserAPI(credentials);
      return data;
    },
    onSuccess: invalidateUsers,
  });
};
