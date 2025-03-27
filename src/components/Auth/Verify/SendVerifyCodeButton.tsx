// UI Components
import LoadingButton from '@/components/LoadingButton';

// Redux
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

// Hooks
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSendVerifyCodeMutation } from './mutations';

// Component to handle sending verification code with countdown timer
export default function SendVerifyCodeButton() {
  const { user } = useAppSelector(selectAuth);
  const { toast } = useToast();
  const { mutate, isPending } = useSendVerifyCodeMutation();

  // State for countdown timer
  const [countdown, setCountdown] = useState({
    isActive: false,
    seconds: 60,
  });

  // Handler for sending verification code
  const handleSendVerifyCode = useCallback(() => {
    if (!user?.id) return;

    // Call mutation to send verification code
    mutate(
      { userId: user.id },
      {
        // On successful code send
        onSuccess: (data) => {
          // Start countdown timer
          setCountdown({
            isActive: true,
            seconds: 60,
          });

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

  // Effect to handle countdown timer
  useEffect(() => {
    // Return if countdown is not active
    if (!countdown.isActive) return;

    // Set interval to decrease countdown every second
    const timer = setInterval(() => {
      setCountdown((prev) => {
        // Reset countdown when reaching zero
        if (prev.seconds <= 0) {
          return { isActive: false, seconds: 0 };
        }
        // Decrease seconds by 1
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);

    // Cleanup interval on unmount or when countdown becomes inactive
    return () => clearInterval(timer);
  }, [countdown.isActive]);

  // Compute button states
  const isDisabled = countdown.isActive || isPending;
  const buttonText = countdown.isActive ? `${countdown.seconds}s` : 'Send verify code';

  return (
    <LoadingButton
      disabled={isDisabled}
      type='button'
      className='border-primary border-[2px]'
      variant='outline'
      onClick={handleSendVerifyCode}
      loading={isPending}
    >
      {buttonText}
    </LoadingButton>
  );
}
