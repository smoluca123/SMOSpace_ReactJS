'use no memo';

// Import dependencies
import CountdownButton from '@/components/CountdownButton';
import PasswordInput from '@/components/PasswordInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { StepControllerType } from '@/hooks/useStep';
import { resetPasswordSchema, ResetPasswordValues } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UseResetPasswordMutation, useSendResetPasswordCodeToEmailMutation } from './mutations';
import { useToast } from '@/hooks/use-toast';
import LoadingButton from '@/components/LoadingButton';
import { useCallback } from 'react';

// Reset password form component
export default function ResetPasswordForm({
  stepController,
}: {
  stepController: StepControllerType;
}) {
  // Get step controller methods
  const { resetStep, prevStep } = stepController;

  // Get email from URL params
  const [searchParams] = useSearchParams();
  const userEmail = searchParams.get('email') || '';

  // Navigation hook
  const navigate = useNavigate();

  // Mutations for resetting password and sending verification code
  const { mutate: resetPasswordMutate, isPending } = UseResetPasswordMutation();

  const { mutate: sendVerifyCodeToEmailMutate, isPending: sendingVerifyCode } =
    useSendResetPasswordCodeToEmailMutation();

  // Toast notifications
  const { toast } = useToast();

  // Initialize form with validation
  const form = useForm<ResetPasswordValues>({
    defaultValues: {
      code: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onSubmit',
  });

  // Handle sending verification code
  const handleSendVerifyCode = useCallback(() => {
    if (!userEmail) return;

    sendVerifyCodeToEmailMutate(
      { userEmail },
      {
        onSuccess: (data) => {
          toast({
            title: 'Success',
            description: data.message,
          });
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
          prevStep();
        },
      },
    );
  }, [toast, prevStep, sendVerifyCodeToEmailMutate, userEmail]);

  // Handle password reset submission
  const handleResetPassword = (data: ResetPasswordValues) => {
    resetPasswordMutate(
      { password: data.password, verifyCode: data.code, userEmail },
      {
        onSuccess: (data) => {
          toast({
            title: 'Success',
            description: data.message,
          });
          navigate('/auth/login', { replace: true });
          resetStep();
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        },
      },
    );
  };

  return (
    <div>
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(handleResetPassword)}>
          {/* Verification code input field */}
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel>Verify code</FormLabel>
                <FormControl>
                  <div className='flex gap-x-5 items-center'>
                    <Input
                      className='flex-1'
                      placeholder='Enter 6-digit verification code'
                      maxLength={6}
                      {...field}
                    />
                    {/* Send verification code button with countdown */}
                    <CountdownButton
                      isCountFirstTime
                      className='border-primary border-[2px] whitespace-nowrap'
                      variant='outline'
                      countdownTime={60}
                      reCountWhenClicked
                      loading={sendingVerifyCode}
                      onClick={handleSendVerifyCode}
                    >
                      Send again
                    </CountdownButton>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* New password input field */}
          <FormField
            name='password'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder='Enter new password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm password input field */}
          <FormField
            name='confirmPassword'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder='Confirm your password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <LoadingButton loading={isPending} className='mt-3 w-full'>
            Reset Password
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
