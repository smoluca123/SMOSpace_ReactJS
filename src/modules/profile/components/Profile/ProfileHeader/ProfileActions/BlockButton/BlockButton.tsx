'use client';

import { UUID } from 'crypto';
import { Button } from '@/components/ui/button';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface IProps {
  userId: UUID;
  className?: string;
}

export default function BlockButton({ userId, className }: IProps) {
  // TODO: Replace with actual block status from user data
  const [isBlocked, setIsBlocked] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleBlock = async () => {
    setIsPending(true);
    try {
      // TODO: Call API to block user
      // await blockUser(userId);
      console.log('Block user:', userId);
      setIsBlocked(true);
    } catch (error) {
      console.error('Failed to block user:', error);
    } finally {
      setIsPending(false);
    }
  };

  const handleUnblock = async () => {
    setIsPending(true);
    try {
      // TODO: Call API to unblock user
      // await unblockUser(userId);
      console.log('Unblock user:', userId);
      setIsBlocked(false);
    } catch (error) {
      console.error('Failed to unblock user:', error);
    } finally {
      setIsPending(false);
    }
  };

  if (isBlocked) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='outline' className={className} disabled={isPending}>
            <ShieldCheck className='h-4 w-4' />
            Unblock
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unblock this user?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be able to see their posts and interact with them again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnblock}>Unblock</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' className={className} disabled={isPending}>
          <ShieldBan className='h-4 w-4' />
          Block
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Block this user?</AlertDialogTitle>
          <AlertDialogDescription>
            They won&apos;t be able to see your posts or interact with you. You can unblock them
            anytime.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleBlock}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Block
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
