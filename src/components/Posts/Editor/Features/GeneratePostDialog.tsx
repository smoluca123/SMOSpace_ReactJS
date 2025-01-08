'use client';

import GeneratePostForm from '@/components/Posts/Editor/Features/GeneratePostForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { Editor } from '@tiptap/react';
import { Coins } from 'lucide-react';

interface GeneratePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  createPostEditor: Editor | null;
}

const CreditBalanceCard = ({ credits }: { credits: number }) => (
  <div className='bg-card w-full md:w-[20rem] rounded-md p-5 text-foreground space-y-5 border border-border'>
    <h6>Available balance</h6>
    <h2 className='flex items-center text-3xl font-semibold tracking-wide gap-x-2'>
      {credits} <Coins className='text-primary' />
    </h2>
    <p>Credits</p>
    <Button className='w-full text-primary' variant='secondary'>
      Buy Credits
    </Button>
  </div>
);

export default function GeneratePostDialog({
  createPostEditor,
  isOpen,
  onClose,
}: GeneratePostDialogProps) {
  const { user } = useAppSelector(selectAuth);

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => isOpen && onClose()}>
      <DialogContent className='md:max-w-full md:w-fit'>
        <DialogHeader>
          <DialogTitle>Generate Post</DialogTitle>
          <DialogDescription>
            Generate new post content using AI. This will consume credits from your balance.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-start gap-5 md:flex-row'>
          <CreditBalanceCard credits={user.credits} />
          <GeneratePostForm createPostEditor={createPostEditor} closeDialog={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
