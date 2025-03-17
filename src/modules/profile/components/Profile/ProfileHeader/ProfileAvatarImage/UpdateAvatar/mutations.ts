import { updateAvatarAPI } from '@/apis/userApi';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import { useMutation } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const useUpdateAvatarMutation = ({ userId }: { userId: UUID }) => {
  const { update } = useUpdateDataInfomation();
  const updateAvatar = async (imageFile: File) => {
    try {
      const { data } = await updateAvatarAPI({ userId: userId, imageFile });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['update-avatar'],
    mutationFn: updateAvatar,
    onSuccess: (data) => {
      update({
        data,
      });
    },
  });
  return mutation;
};
