import { deleteFriendAPI } from '@/apis/userApi';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import { getUserInfomationQueryKey } from '@/lib/querys';
import {
  IApiPaginationResponseWrapper,
  IFriendRequestWithFriendDataType,
  IUserDataType,
  IUserDataWithFollowedStatusType,
} from '@/lib/types/interfaces';
import { getMyFriendRequestsQueryKey } from '@/modules/friends/components/FriendRequests/querys';
import {
  getMyFriendsQueryKey,
  getUserFriendsQueryKey,
} from '@/modules/profile/components/Profile/ProfileContent/FriendList/querys';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

export function useDeleteFriend() {
  const { update: updateUserInfomation } = useUpdateDataInfomation();
  const queryClient = useQueryClient();
  const deleteFriend = async ({ userId }: { userId: UUID }) => {
    const { data } = await deleteFriendAPI({ userId });
    return data;
  };

  const mutation = useMutation({
    mutationKey: ['deleteFriend'],
    mutationFn: deleteFriend,
    onSuccess: (newData) => {
      // Define a query filter to target the specific query for friend requests
      const friendRequestQueryFilter = {
        queryKey: getMyFriendRequestsQueryKey,
      };

      // Define a query filter to target the specific query for the user data
      const userDataQueryFilter = {
        queryKey: getUserInfomationQueryKey({ userId: newData.user.id }),
      };

      // Define a query filter to target the specific query for the friend list
      const myFriendListQueryFilter = {
        queryKey: getMyFriendsQueryKey(),
      };

      // Define a query filter to target the specific query for the friend list
      const userFriendListQueryFilter = {
        queryKey: getUserFriendsQueryKey(newData.user.id),
      };

      // Cancel any ongoing queries that match the friend request query filter
      queryClient.cancelQueries(friendRequestQueryFilter);
      // Cancel any ongoing queries that match the friend list query filter
      queryClient.cancelQueries(myFriendListQueryFilter);

      // Update the cached data for the friend requests query
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<IFriendRequestWithFriendDataType>['data']>
      >(friendRequestQueryFilter, (data) => {
        if (!data) return; // If there's no data, return immediately
        return {
          ...data,
          pages: data.pages.map((page) => {
            return {
              ...page,
              items: page.items.filter((item) => item.id !== newData.id), // Remove the deleted friend from the list
            };
          }),
        };
      });

      // Update the cached data for the user data query
      queryClient.setQueriesData<IUserDataWithFollowedStatusType>(userDataQueryFilter, (data) => {
        if (!data) return;
        return {
          ...data,
          ...newData.user,
        };
      });

      // Update the cached data for the my friend list query
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<IUserDataType>['data']>
      >(myFriendListQueryFilter, (data) => {
        if (!data) return; // If there's no data, return immediately
        return {
          ...data,
          pages: data.pages.map((page) => {
            return {
              ...page,
              items: page.items.filter((item) => item.id !== newData.user.id), // Remove the deleted friend from the list
            };
          }),
        };
      });

      // Update the cached data for the user friend list query
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<IUserDataType>['data']>
      >(userFriendListQueryFilter, (data) => {
        if (!data) return; // If there's no data, return immediately
        return {
          ...data,
          pages: data.pages.map((page) => {
            return {
              ...page,
              items: page.items.filter((item) => item.id !== newData.friend.id), // Remove the deleted friend from the list
            };
          }),
        };
      });

      // Update additional user information with the new data
      updateUserInfomation({
        data: newData.friend,
      });
    },
  });

  return mutation;
}
