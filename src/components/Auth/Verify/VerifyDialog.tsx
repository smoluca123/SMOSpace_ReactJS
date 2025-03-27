// Import UI components
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

// Import hooks and utilities
import { handleMaskEmail } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { selectDialog, setAuthDialogOpen } from '@/redux/slices/dialogSlice';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import VerifyButton from './VerifyButton';
import SendVerifyCodeButton from './SendVerifyCodeButton';
import { Mail } from 'lucide-react';

export default function VerifyDialog() {
  // Redux state and hooks
  const { user } = useAppSelector(selectAuth);
  const { authDialog } = useAppSelector(selectDialog);
  const dispatch = useAppDispatch();

  // Local state
  const [verifyCodeValue, setVerifyCodeValue] = useState('');
  const maskEmail = handleMaskEmail(user?.email);

  // Handle dialog close
  const handleCloseDialog = (isOpen?: boolean) => {
    dispatch(setAuthDialogOpen({ isOpen: isOpen }));
  };

  return (
    <Dialog open={authDialog.isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent>
        {/* Dialog title */}
        <DialogTitle>Verify you account</DialogTitle>

        <Separator />

        {/* Dialog content */}
        <div className='space-y-5'>
          {/* Dialog Description */}
          <DialogDescription className='space-y-4 text-muted-foreground'>
            <h1>
              Clik on the <span className='text-foreground'>"Send verify code"</span> bellow to get
              a OTP via Email
            </h1>
            <div className='flex items-center gap-x-5'>
              <Mail />
              <span className='font-bold text-foreground'>{maskEmail}</span>
            </div>
          </DialogDescription>

          {/* Verify form */}
          <form className='space-y-8 '>
            <div className='flex gap-x-5'>
              <Input
                value={verifyCodeValue}
                onChange={(e) => setVerifyCodeValue(e.target.value)}
                placeholder='Verification code'
                maxLength={6}
              />

              {/* Sent Verify code button */}
              <SendVerifyCodeButton />
            </div>

            {/* Verify button */}
            <VerifyButton
              verifyCodeValue={verifyCodeValue}
              onVerified={() => {
                handleCloseDialog(false);
              }}
            />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
