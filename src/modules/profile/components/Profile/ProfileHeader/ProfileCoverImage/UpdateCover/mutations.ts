import { updateCoverImageAPI } from '@/apis/userApi';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import { useMutation } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const useUpdateCoverImageMutation = ({ userId }: { userId: UUID }) => {
  const { update } = useUpdateDataInfomation();
  const updateCoverImage = async (imageFile: File) => {
    try {
      const { data } = await updateCoverImageAPI({ userId: userId, imageFile });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['update-cover-image'],
    mutationFn: updateCoverImage,
    onSuccess: (data) => {
      update({
        data,
      });
    },
  });
  return mutation;
};
