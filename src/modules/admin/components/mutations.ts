import { adminDeletePostAPI, adminDeletePostsAPI, adminEditPostAPI } from '@/apis/postApi';
import { IUpdateInfomationType } from '@/apis/types/interfaces';
import {
  adminToggleBanUserAPI,
  adminToggleBanUsers,
  adminUpdateUserInfomationAPI,
} from '@/apis/userApi';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const useAdminDeletePostmutation = () => {
  const queryClient = useQueryClient();

  const handleDeletePost = async ({ postId }: { postId: UUID }) => {
    try {
      const data = await adminDeletePostAPI({ postId });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['admin-delete-post'],
    mutationFn: handleDeletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    },
  });

  return mutation;
};

export const useAdminEditPostMutation = () => {
  const queryClient = useQueryClient();

  const handleEditPost = async ({
    postId,
    content,
    isPrivate,
    authorId,
  }: {
    postId: UUID;
    content: string;
    isPrivate: boolean;
    authorId: UUID;
  }) => {
    try {
      const data = await adminEditPostAPI({
        postId,
        content,
        isPrivate,
        authorId,
      });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['admin-edit-post'],
    mutationFn: handleEditPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts', 'profile'],
      });
    },
  });

  return mutation;
};

export const useAdminToggleBanUserMutation = () => {
  const queryClinet = useQueryClient();

  const togglebanUser = async ({ userId, isBanned }: { userId: UUID; isBanned: boolean }) => {
    try {
      const { data } = await adminToggleBanUserAPI({ userId, isBanned });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['toggle-ban-user'],
    mutationFn: togglebanUser,
    onSuccess: () => {
      queryClinet.invalidateQueries({
        queryKey: ['admin-users'],
      });
    },
  });

  return mutation;
};

export const useAdminUpdateUserInfomation = ({ userId }: { userId: UUID }) => {
  const { user } = useAppSelector(selectAuth);
  const queryClinet = useQueryClient();
  const isMe = user?.id === userId;
  const { update } = useUpdateDataInfomation();

  const handleUpdateUserInfomation = async ({
    newUserData,
  }: {
    newUserData: IUpdateInfomationType;
  }) => {
    try {
      const { data } = await adminUpdateUserInfomationAPI({ userId, newUserData });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const muation = useMutation({
    mutationKey: ['update-user-infomation'],
    mutationFn: handleUpdateUserInfomation,
    onSuccess: (data) => {
      queryClinet.invalidateQueries({
        queryKey: ['admin-users'],
      });
      if (isMe && user) {
        update({
          ...user,
          data,
        });
      }
    },
  });

  return muation;
};

export const useAdminToggleBanUsersMutaion = () => {
  const queryClinet = useQueryClient();

  const handleBanUsers = async (banList: { userId: UUID; isBanned: boolean }[]) => {
    try {
      const data = await adminToggleBanUsers(banList);
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['toggle-ban-users'],
    mutationFn: handleBanUsers,
    onSuccess: () => {
      queryClinet.invalidateQueries({
        queryKey: ['admin-users'],
      });
    },
  });

  return mutation;
};

export const useAdminDeletePosts = () => {
  const queryClinet = useQueryClient();

  const handleDeletePosts = async (postsId: string[]) => {
    try {
      const data = await adminDeletePostsAPI(postsId);
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['delete-posts'],
    mutationFn: handleDeletePosts,
    onSuccess: () => {
      queryClinet.invalidateQueries({
        queryKey: ['admin-posts'],
      });
    },
  });

  return mutation;
};
