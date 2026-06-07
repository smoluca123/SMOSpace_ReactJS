import { toggleBlockFriendAPI } from '@/apis/userApi';
import {
  getMyInfomationQueryKey,
  getUserFollowersQueryKey,
  getUserFollowingsQueryKey,
  getUserInfomationQueryKey,
} from '@/lib/querys';
import {
  IUserDataTypeWithFriendStatus,
  IUserDataWithFollowedStatusType,
} from '@/lib/types/interfaces';
import { getMyFriendRequestsQueryKey } from '@/modules/friends/components/FriendRequests/querys';
import { getMyFriendsQueryKey } from '@/modules/profile/components/Profile/ProfileContent/FriendList/querys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

/**
 * Toggle block / unblock for a user.
 *
 * Blocking removes any follow + friendship relationship server-side, so the
 * client refreshes feeds, follower/following lists, friend lists and the
 * profile cache to reflect the new state immediately.
 */
export function useToggleBlockMutation({ userId }: { userId: UUID }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['toggle-block', { userId }],
    mutationFn: async () => await toggleBlockFriendAPI({ userId }),
    onSuccess: (response) => {
      const isBlocked = response.data.status === 'BLOCKED';

      // Reflect the new block status on the target user's profile cache
      queryClient.setQueryData<IUserDataWithFollowedStatusType & IUserDataTypeWithFriendStatus>(
        getUserInfomationQueryKey({ userId }),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            friend: (isBlocked ? response.data : null) as IUserDataTypeWithFriendStatus['friend'],
            isFollowedByUser: false,
          };
        },
      );

      // Feeds may now need to add/remove this user's posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: getUserInfomationQueryKey({ userId }) });
      queryClient.invalidateQueries({ queryKey: getMyInfomationQueryKey });
      queryClient.invalidateQueries({ queryKey: getMyFriendsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getMyFriendRequestsQueryKey });
      queryClient.invalidateQueries({ queryKey: getUserFollowersQueryKey({ userId }) });
      queryClient.invalidateQueries({ queryKey: getUserFollowingsQueryKey({ userId }) });
    },
    onError: (error) => {
      console.error('Failed to toggle block:', error);
    },
  });
}
