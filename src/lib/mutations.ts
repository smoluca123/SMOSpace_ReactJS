import { IUpdateInfomationType } from '@/apis/types/interfaces';
import { updateInfomationAPI } from '@/apis/userApi';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import { useMutation } from '@tanstack/react-query';

export const useUpdateMyInfomationMutation = () => {
  const { update } = useUpdateDataInfomation();

  const handleUpdateMyInfomation = async (newData: IUpdateInfomationType) => {
    try {
      const { data } = await updateInfomationAPI(newData);
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['update-my-infomation'],
    mutationFn: handleUpdateMyInfomation,
    onSuccess: (newUserData) => {
      if (!newUserData) return;

      update({
        data: newUserData,
      });
    },
  });

  return mutation;
};
