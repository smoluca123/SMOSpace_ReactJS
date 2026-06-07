import { toggleFriendshipRequestAPI } from '@/apis/userApi';
import { notificationsQueryKey } from '@/components/Notification/querys';
import { getMyInfomationQueryKey, getUserInfomationQueryKey } from '@/lib/querys';
import {
  IApiPaginationResponseWrapper,
  IFriendRequestWithFriendDataType,
  IUserDataType,
  IUserDataTypeWithFriendStatus,
  IUserDataWithFollowedStatusType,
} from '@/lib/types/interfaces';
import { getMyFriendRequestsQueryKey } from '@/modules/friends/components/FriendRequests/querys';
import { getMyFriendsQueryKey } from '@/modules/profile/components/Profile/ProfileContent/FriendList/querys';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

interface UseToggleFriendshipRequestMutationProps {
  userId: UUID;
}

/**
 * Shared friendship toggle mutation used by FriendButton / AddFriendButton.
 *
 * The backend toggle endpoint smartly resolves the action based on the current
 * relationship (send request / cancel request / accept request / mutual accept),
 * so the client only needs to fire the toggle and reconcile its caches.
 */
export function useToggleFriendshipRequestMutation({
  userId,
}: UseToggleFriendshipRequestMutationProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['toggle-friendship', { userId }],
    mutationFn: async () => {
      return await toggleFriendshipRequestAPI({ userId });
    },
    onMutate: async () => {
      const profileQueryKey = getUserInfomationQueryKey({ userId });
      await queryClient.cancelQueries({ queryKey: profileQueryKey });

      const previousUserData = queryClient.getQueryData<
        IUserDataWithFollowedStatusType & IUserDataTypeWithFriendStatus
      >(profileQueryKey);

      return { previousUserData };
    },
    onSuccess: (response) => {
      // Only PENDING / ACCEPTED represent an active relationship; anything else
      // (e.g. REJECTED after cancelling a request) means "no relationship".
      const status = response.data.status;
      const hasActiveRelationship = status === 'PENDING' || status === 'ACCEPTED';

      // Update the target user's profile cache with the new friend status
      queryClient.setQueryData<IUserDataWithFollowedStatusType & IUserDataTypeWithFriendStatus>(
        getUserInfomationQueryKey({ userId }),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            friend: (hasActiveRelationship
              ? response.data
              : null) as IUserDataTypeWithFriendStatus['friend'],
          };
        },
      );

      // Refresh related data so counts and lists stay in sync
      queryClient.invalidateQueries({ queryKey: getUserInfomationQueryKey({ userId }) });
      queryClient.invalidateQueries({ queryKey: getMyInfomationQueryKey });
      queryClient.invalidateQueries({ queryKey: getMyFriendsQueryKey() });
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });

      // If a friendship just got accepted, refetch the requests list to drop it.
      // Otherwise (request sent/cancelled) prune the cached request item directly.
      if (response.data.status === 'ACCEPTED') {
        queryClient.invalidateQueries({ queryKey: getMyFriendRequestsQueryKey });
      } else {
        queryClient.setQueriesData<
          InfiniteData<IApiPaginationResponseWrapper<IFriendRequestWithFriendDataType>['data']>
        >({ queryKey: getMyFriendRequestsQueryKey }, (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter((item) => item.friend.id !== userId),
            })),
          };
        });
      }

      // Keep the friend list in sync when a relationship is removed
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<IUserDataType>['data']>
      >({ queryKey: getMyFriendsQueryKey() }, (oldData) => {
        if (!oldData) return oldData;
        if (response.data.status === 'ACCEPTED') return oldData;
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
      if (context?.previousUserData) {
        queryClient.setQueryData(getUserInfomationQueryKey({ userId }), context.previousUserData);
      }
      console.error('Failed to toggle friendship request:', error);
    },
  });
}
