// Import UI components
import LoadingButton from '@/components/LoadingButton';

// Import hooks and utilities
import { useActiveAccountMutation } from './mutations';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useToast } from '@/hooks/use-toast';

// Component props interface
interface IPorps {
  onVerified: () => void; // Callback function called after successful verification
  verifyCodeValue: string; // The verification code entered by user
}

export default function VerifyButton({ onVerified, verifyCodeValue, ...props }: IPorps) {
  // Hooks
  const { mutate, isPending } = useActiveAccountMutation(); // Mutation hook for account verification
  const { user } = useAppSelector(selectAuth); // Get current user from Redux store
  const { toast } = useToast(); // Toast notification hook

  /**
   * Handle account verification
   * Calls the verification mutation with user ID and verification code
   */
  const handleVerifyAccount = () => {
    if (!user) return;

    mutate(
      { userId: user.id, verifyCode: verifyCodeValue },
      {
        onSuccess: () => {
          // Show success toast and call callback
          toast({
            title: 'Account verified successfully',
            description: 'Your account has been verified',
          });
          onVerified();
        },
        onError: (error) => {
          // Show error toast on failure
          toast({
            variant: 'destructive',
            title: 'Verification failed',
            description: error.message || 'Please try again',
          });
        },
      },
    );
  };

  return (
    <LoadingButton
      disabled={verifyCodeValue.length < 6} // Disable if code is not 6 digits
      loading={isPending} // Show loading state during verification
      type='button'
      className='w-full text-white'
      onClick={handleVerifyAccount}
      {...props}
    >
      {isPending ? 'Verifying...' : 'Verify'}
    </LoadingButton>
  );
}
