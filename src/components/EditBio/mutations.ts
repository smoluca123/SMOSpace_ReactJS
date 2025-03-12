import { updateInfomationAPI } from '@/apis/userApi';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import { useMutation } from '@tanstack/react-query';

export function useUpdateBio() {
  const { update: updateUserInfomation } = useUpdateDataInfomation();

  const updateBio = async (bio: string) => {
    try {
      const { data } = await updateInfomationAPI({ bio });
      return data;
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationFn: updateBio,
    onSuccess: (data) => {
      updateUserInfomation({ data });
    },
  });

  return mutation;
}
