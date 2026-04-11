import { toggleFriendshipRequestAPI } from '@/apis/userApi';
import {
  IApiPaginationResponseWrapper,
  IFriendRequestWithFriendDataType,
  IUserDataType,
  IUserDataTypeWithFriendStatus,
  IUserDataWithFollowedStatusType,
} from '@/lib/types/interfaces';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

interface UseToggleFriendshipRequestMutationProps {
  userId: UUID;
}

export function useToggleFriendshipRequestMutation({
  userId,
}: UseToggleFriendshipRequestMutationProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await toggleFriendshipRequestAPI({ userId });
    },
    onMutate: async () => {
      // Cancel any outgoing refetches for the correct query key
      await queryClient.cancelQueries({ queryKey: ['profile', { userId }] });

      // Snapshot the previous value
      const previousUserData = queryClient.getQueryData<
        IUserDataWithFollowedStatusType & IUserDataTypeWithFriendStatus
      >(['profile', { userId }]);

      return { previousUserData };
    },
    onSuccess: (response) => {
      // Update user information cache with new friend status
      queryClient.setQueryData<IUserDataWithFollowedStatusType & IUserDataTypeWithFriendStatus>(
        ['profile', { userId }],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            friend: response.data,
          };
        },
      );

      // Invalidate related queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['profile', { userId }] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      queryClient.invalidateQueries({ queryKey: ['my-friends'] });

      // Update friend requests list if exists
      const friendRequestQueryFilter = {
        queryKey: ['friend-requests'],
      };

      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<IFriendRequestWithFriendDataType>['data']>
      >(friendRequestQueryFilter, (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.filter((item) => item.friend.id !== userId),
          })),
        };
      });

      // Update friends list if exists
      const friendsQueryFilter = {
        queryKey: ['my-friends'],
      };

      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<IUserDataType>['data']>
      >(friendsQueryFilter, (oldData) => {
        if (!oldData) return;

        // If friendship was accepted, the user will be added via invalidation
        // If friendship was cancelled/removed, remove from list
        if (response.data.status === 'ACCEPTED') {
          return oldData;
        }

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.filter((item) => item.id !== userId),
          })),
        };
      });
    },
    onError: (error, _variables, context) => {
      // Rollback to previous data on error
      if (context?.previousUserData) {
        queryClient.setQueryData(['profile', { userId }], context.previousUserData);
      }
      console.error('Failed to toggle friendship request:', error);
    },
  });
}
