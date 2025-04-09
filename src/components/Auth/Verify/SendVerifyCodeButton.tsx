// UI Components
import CountdownButton from '@/components/CountdownButton';

// Redux
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

// Hooks
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSendVerifyCodeMutation } from './mutations';

// Component to handle sending verification code with countdown timer
export default function SendVerifyCodeButton() {
  const { user } = useAppSelector(selectAuth);
  const { toast } = useToast();
  const { mutate, isPending } = useSendVerifyCodeMutation();

  // Handler for sending verification code
  const handleSendVerifyCode = useCallback(() => {
    if (!user?.id) return;

    // Call mutation to send verification code
    mutate(
      { userId: user.id },
      {
        // On successful code send
        onSuccess: (data) => {
          // Show success toast
          toast({
            title: 'Success',
            description: data?.message,
          });
        },
        // On error in code send
        onError: ({ message }) => {
          // Show error toast
          toast({
            title: 'Error',
            variant: 'destructive',
            description: message,
          });
        },
      },
    );
  }, [user, mutate, toast]);

  return (
    <CountdownButton
      className='border-primary border-[2px]'
      variant='outline'
      onClick={handleSendVerifyCode}
      loading={isPending}
      countdownTime={60}
      reCountWhenClicked
    >
      Send verify code
    </CountdownButton>
  );
}
