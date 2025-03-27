import { activeAccountAPI, sendVerificationCodeToEmamilAPI } from '@/apis/userApi';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import { useMutation } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const useSendVerifyCodeMutation = () => {
  const handleReSendVerifyCode = async ({ userId }: { userId: UUID }) => {
    if (!userId) return;
    try {
      const data = await sendVerificationCodeToEmamilAPI({ userId });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['send-verify-code'],
    mutationFn: handleReSendVerifyCode,
  });

  return mutation;
};

export const useActiveAccountMutation = () => {
  const { update } = useUpdateDataInfomation();

  const handleActiveAccount = async ({
    verifyCode,
    userId,
  }: {
    verifyCode: string;
    userId: UUID;
  }) => {
    try {
      const { data } = await activeAccountAPI({
        verifyCode,
        userId,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['active-account'],
    mutationFn: handleActiveAccount,
    onSuccess: (newUserData) => {
      update({ data: newUserData });
    },
  });

  return mutation;
};
