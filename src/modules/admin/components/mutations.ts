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

export const useAdminDeletePostMutation = () => {
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
      ['admin-posts', 'post-count'].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
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
      ['admin-posts', 'post-count'].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
  });

  return mutation;
};

export const useAdminToggleBanUserMutation = () => {
  const queryClient = useQueryClient();

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
      ['admin-users', 'user-count'].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
  });

  return mutation;
};

export const useAdminUpdateUserInfoMutation = ({ userId }: { userId: UUID }) => {
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
  const queryClient = useQueryClient();

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
      ['admin-users', 'user-count'].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
  });

  return mutation;
};

export const useAdminDeletePostsMutation = () => {
  const queryClient = useQueryClient();

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
      ['admin-posts', 'post-count'].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
  });

  return mutation;
};

export const useAdminCreateuserMutation = () => {
  const queryClient = useQueryClient();

  const handleCreateUser = async (credentials: AdminCreateUserType) => {
    try {
      const { data } = await adminCreateUserAPI(credentials);
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['admin-create-user'],
    mutationFn: handleCreateUser,
    onSuccess: () => {
      ['admin-users', 'user-count'].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
  });

  return mutation;
};
