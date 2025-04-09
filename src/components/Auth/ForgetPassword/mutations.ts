import { resetPasswordAPI, sendResetPasswordCodeToEmailAPI } from '@/apis/userApi';
import { useMutation } from '@tanstack/react-query';

export const useSendResetPasswordCodeToEmailMutation = () => {
  const handleSendVerifyCode = async ({ userEmail }: { userEmail: string }) => {
    try {
      const data = await sendResetPasswordCodeToEmailAPI({ userEmail });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['get-verify-code'],
    mutationFn: handleSendVerifyCode,
  });

  return mutation;
};

export const UseResetPasswordMutation = () => {
  const handleResetPassword = async ({
    userEmail,
    verifyCode,
    password,
  }: {
    userEmail: string;
    verifyCode: string;
    password: string;
  }) => {
    try {
      const data = await resetPasswordAPI({ userEmail, verifyCode, password });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['reset-password'],
    mutationFn: handleResetPassword,
  });

  return mutation;
};
