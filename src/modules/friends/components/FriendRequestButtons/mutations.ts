import { acceptFriendRequestAPI, cancelFriendRequestAPI } from '@/apis/userApi';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import { useMutation } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const useCancelFriendRequest = () => {
  const { update: updateDataInfomation } = useUpdateDataInfomation();

  const cancelFriendRequest = async (userId: UUID) => {
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
    onSuccess: (data) => {
      updateDataInfomation({
        data: data.friend,
      });
    },
  });
  return mutation;
};

export const useAcceptFriendRequest = () => {
  const { update: updateDataInfomation } = useUpdateDataInfomation();
  const acceptFriendRequest = async (userId: UUID) => {
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
    onSuccess: (data) => {
      updateDataInfomation({
        data: data.friend,
      });
    },
  });
  return mutation;
};
