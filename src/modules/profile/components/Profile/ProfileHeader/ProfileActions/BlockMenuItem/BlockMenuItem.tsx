import { UUID } from 'crypto';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import DropdownMenuItemWithIcon from '@/components/DropdownMenuItemWithIcon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useGetUserInfomation } from '@/lib/querys';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useToggleBlockMutation } from './mutations';

interface IProps {
  userId: UUID;
  /** Friend relationship status of the target user, if already known. */
  friend?: { status?: string; userId?: string } | null;
  fullName?: string;
}

export default function BlockMenuItem({ userId, friend, fullName }: IProps) {
  const { user: currentUser } = useAppSelector(selectAuth);
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useToggleBlockMutation({ userId });

  // When the caller doesn't provide the relationship, fetch it so the menu can
  // reflect the correct Block vs Unblock state (e.g. from the chat menus).
  const { data: fetchedInfo } = useGetUserInfomation({ userId }, { enabled: friend === undefined });

  const effectiveFriend = friend ?? fetchedInfo?.friend;

  // The block row stores the blocker in `userId`. Only the blocker sees "unblock".
  const isBlockedByMe =
    effectiveFriend?.status === 'BLOCKED' && effectiveFriend?.userId === currentUser?.id;

  const handleToggleBlock = () => {
    mutate(undefined, {
      onSuccess: (response) => {
        const blocked = response.data.status === 'BLOCKED';
        toast({
          title: blocked ? 'Blocked' : 'Unblocked',
          description: blocked
            ? `You have blocked ${fullName || 'this user'}.`
            : `You have unblocked ${fullName || 'this user'}.`,
          duration: 3000,
        });
        setIsOpen(false);
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: String(error) || 'Action failed',
          variant: 'destructive',
          duration: 3000,
        });
      },
    });
  };

  return (
    <>
      <DropdownMenuItemWithIcon
        Icon={isBlockedByMe ? ShieldCheck : ShieldBan}
        variant={isBlockedByMe ? 'default' : 'destructive'}
        onClick={() => setIsOpen(true)}
        onSelect={(e) => e.preventDefault()}
      >
        {isBlockedByMe ? 'Unblock' : 'Block'}
      </DropdownMenuItemWithIcon>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isBlockedByMe ? 'Unblock this user?' : 'Block this user?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isBlockedByMe
                ? 'You will be able to see their posts and interact with them again.'
                : 'They will no longer be able to see your posts or message you, and any follow/friend relationships will be removed. You can unblock them at any time.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleBlock}
              disabled={isPending}
              className={
                isBlockedByMe
                  ? ''
                  : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              }
            >
              {isPending ? 'Processing...' : isBlockedByMe ? 'Unblock' : 'Block'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
