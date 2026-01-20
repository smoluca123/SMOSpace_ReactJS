import { followUserAPI, unfollowUserAPI } from '@/apis/userApi';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import { getUserInfomationQueryKey } from '@/lib/querys';
import { IApiResponseWrapper, IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const useFollowUserMutation = ({ userId }: { userId: UUID }) => {
  const queryClient = useQueryClient();
  const { user } = useAppSelector(selectAuth);
  const { update } = useUpdateDataInfomation();

  // FollowUser function
  const followUser = async () => {
    try {
      const { data } = await followUserAPI({ userId });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  // Create  mutation
  const mutation = useMutation({
    mutationKey: ['follow-user', { userId }],
    mutationFn: followUser,
    onSuccess: async (followData) => {
      if (!followData || !user) return;

      // Define query filters for cache updates
      const queryFilters = {
        queryKey: getUserInfomationQueryKey({ userId }),
      };

      // Update cached user data with new follower count and status
      queryClient.setQueriesData<IApiResponseWrapper<IUserDataWithFollowedStatusType>>(
        queryFilters,
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            followerCount: followData.following.followerCount,
            isFollowedByUser: followData.following.isFollowedByUser,
          };
        },
      );

      // update the user data in the query cache
      update({
        data: {
          ...user,
          followingCount: followData?.follower.followingCount,
        },
      });
    },
  });

  return mutation;
};

export const useUnfollowUserMutation = ({ userId }: { userId: UUID }) => {
  const queryClient = useQueryClient();
  const { user } = useAppSelector(selectAuth);
  const { update } = useUpdateDataInfomation();

  // FollowUser function
  const unfollowUser = async () => {
    try {
      const { data } = await unfollowUserAPI({ userId });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  // Create  mutation
  const mutation = useMutation({
    mutationKey: ['unfollow-user', { userId }],
    mutationFn: unfollowUser,
    onSuccess: async (followData) => {
      if (!followData || !user) return;

      // Define query filters for cache updates
      const queryFilters = {
        queryKey: getUserInfomationQueryKey({ userId }),
      };

      // Update cached user data with new follower count and status
      queryClient.setQueriesData<IApiResponseWrapper<IUserDataWithFollowedStatusType>>(
        queryFilters,
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            followerCount: followData.following.followerCount,
            isFollowedByUser: followData.following.isFollowedByUser,
          };
        },
      );

      // update the user data in the query cache
      update({
        data: {
          ...user,
          followingCount: followData?.follower.followingCount,
        },
      });
    },
  });

  return mutation;
};
