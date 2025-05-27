import { acceptFriendRequestAPI, cancelFriendRequestAPI } from '@/apis/userApi';
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

export const useCancelFriendRequest = () => {
  const queryClient = useQueryClient();
  const { update: updateDataInfomation } = useUpdateDataInfomation();

  const cancelFriendRequest = async ({ userId }: { userId: UUID }) => {
    try {
      const { data } = await cancelFriendRequestAPI({ userId });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['cancelFriendRequest'],
    mutationFn: cancelFriendRequest,
    onSuccess: (newData) => {
      const queryFilter = {
        queryKey: getMyFriendRequestsQueryKey,
      };

      queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<IFriendRequestWithFriendDataType>['data']>
      >(queryFilter, (data) => {
        if (!data) return;
        return {
          ...data,
          pages: data.pages.map((page) => {
            return {
              ...page,
              items: page.items.filter((item) => item.id !== newData.id),
            };
          }),
        };
      });

      updateDataInfomation({
        data: newData.friend,
      });
    },
  });
  return mutation;
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();
  const { update: updateDataInfomation } = useUpdateDataInfomation();
  const acceptFriendRequest = async ({ userId }: { userId: UUID }) => {
    try {
      const { data } = await acceptFriendRequestAPI({ userId });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['acceptFriendRequest'],
    mutationFn: acceptFriendRequest,
    onSuccess: (newData) => {
      // Define a query filter to target the specific query for friend requests
      const friendRequestQueryFilter = {
        queryKey: getMyFriendRequestsQueryKey,
      };

      const userDataQueryFilter = {
        queryKey: getUserInfomationQueryKey({ userId: newData.user.id }),
      };

      const myFriendListQueryFilter = {
        queryKey: getMyFriendsQueryKey(),
      };

      const userFriendListQueryFilter = {
        queryKey: getUserFriendsQueryKey(newData.user.id),
      };

      // Cancel any ongoing queries that match the query filter
      queryClient.cancelQueries(friendRequestQueryFilter);
      queryClient.cancelQueries(userDataQueryFilter);

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
              items: page.items.map((item) => {
                // Update the status of the friend request if the ID matches
                if (item.id === newData.id) {
                  return {
                    ...item,
                    status: newData.status,
                  };
                }
                return item; // Return the item unchanged if the ID doesn't match
              }),
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

      // Update the cached data for the user friend list query
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<IUserDataType>['data']>
      >(userFriendListQueryFilter, (data) => {
        if (!data) return;

        const lastPage = data.pages[data.pages.length - 1];
        const newLastPage = {
          ...lastPage,
          items: [...lastPage.items, newData.friend],
        };

        return {
          ...data,
          pages: [...data.pages.slice(0, -1), newLastPage],
        };
      });

      // Update the cached data for the my friend list query
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<IUserDataType>['data']>
      >(myFriendListQueryFilter, (data) => {
        if (!data) return;

        const lastPage = data.pages[data.pages.length - 1];
        const newLastPage = {
          ...lastPage,
          items: [...lastPage.items, newData.user],
        };

        return {
          ...data,
          pages: [...data.pages.slice(0, -1), newLastPage],
        };
      });
      // queryClient.invalidateQueries(myFriendListQueryFilter);

      // Update additional data information with the new friend's data
      updateDataInfomation({
        data: newData.friend,
      });
    },
  });
  return mutation;
};
