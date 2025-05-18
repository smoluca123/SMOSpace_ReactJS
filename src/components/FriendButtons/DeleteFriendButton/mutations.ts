import { deleteFriendAPI } from '@/apis/userApi';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import {
  IApiPaginationResponseWrapper,
  IFriendRequestWithFriendDataType,
} from '@/lib/types/interfaces';
import { getMyFriendRequestsQueryKey } from '@/modules/friends/components/FriendRequests/querys';
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
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
      const queryFilter: QueryFilters<
        InfiniteData<IApiPaginationResponseWrapper<IFriendRequestWithFriendDataType>['data']>
      > = {
        queryKey: getMyFriendRequestsQueryKey,
      };

      queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData(queryFilter, (data) => {
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
      updateUserInfomation({
        data: newData.friend,
      });
    },
  });

  return mutation;
}
