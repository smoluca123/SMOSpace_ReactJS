import { acceptFriendRequestAPI, cancelFriendRequestAPI } from '@/apis/userApi';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import {
  IApiPaginationResponseWrapper,
  IFriendRequestWithFriendDataType,
} from '@/lib/types/interfaces';
import { getMyFriendRequestsQueryKey } from '@/modules/friends/components/FriendRequests/querys';
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
              items: page.items.map((item) => {
                if (item.id === newData.id) {
                  return {
                    ...item,
                    status: newData.status,
                  };
                }
                return item;
              }),
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
