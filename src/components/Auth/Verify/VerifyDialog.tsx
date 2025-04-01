'use no memo';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { handleMaskEmail } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { selectDialog, setAuthDialogOpen } from '@/redux/slices/dialogSlice';
import { Separator } from '@/components/ui/separator';
import SendVerifyCodeButton from './SendVerifyCodeButton';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActiveAccountMutation } from './mutations';
import LoadingButton from '@/components/LoadingButton';
import { useToast } from '@/hooks/use-toast';
import { VerifyValues, verifySchema } from '@/lib/validations';

export default function VerifyDialog() {
  // Redux hooks
  const { user } = useAppSelector(selectAuth);
  const { authDialog } = useAppSelector(selectDialog);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // Mutation hook for account verification
  const { mutate, isPending } = useActiveAccountMutation();

  // Form setup with validation
  const form = useForm<VerifyValues>({
    defaultValues: {
      code: '',
    },
    resolver: zodResolver(verifySchema),
    mode: 'onSubmit',
  });

  // Get masked email for display
  const maskEmail = handleMaskEmail(user?.email);

  // Handle verify account submission
  const handleVerifyAccount = (values: VerifyValues) => {
    if (!user) return;

    mutate(
      { userId: user.id, verifyCode: values.code },
      {
        onSuccess: () => {
          handleCloseDialog(false);
          toast({
            title: 'Account verified successfully',
            description: 'Your account has been verified',
          });
        },
        onError: (error) => {
          toast({
            variant: 'destructive',
            title: 'Verification failed',
            description: error.message || 'Please try again',
          });
        },
      },
    );
  };

  // Handle dialog close
  const handleCloseDialog = (isOpen?: boolean) => {
    dispatch(setAuthDialogOpen({ isOpen: isOpen }));
  };

  return (
    <Dialog open={authDialog.isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent>
        <DialogTitle>Verify you account</DialogTitle>
        <Separator />

        <DialogDescription className='hidden '></DialogDescription>

        <div className='space-y-4 text-muted-foreground'>
          <h1>
            Clik on the <span className='text-foreground'>"Send verify code"</span> bellow to get a
            OTP via Email
          </h1>
          <div className='flex items-center gap-x-5'>
            <Mail />
            <span className='font-bold text-foreground'>{maskEmail}</span>
          </div>
        </div>

        <div className='space-y-5'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleVerifyAccount)} className='space-y-8'>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verify code</FormLabel>
                    <FormControl>
                      <div className='flex gap-x-5'>
                        <Input
                          className='flex-1'
                          {...field}
                          placeholder='Verification code'
                          maxLength={6}
                        />
                        <SendVerifyCodeButton />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton loading={isPending} className='w-full text-white'>
                Verify
              </LoadingButton>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
