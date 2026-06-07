'use no memo';
import { UUID } from 'crypto';
import { useState } from 'react';
import { UserPlus, UserCheck, Clock, UserMinus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetUserInfomation } from '@/lib/querys';
import { useToggleFriendshipRequestMutation } from '@/components/FriendButtons/AddFriendButton/mutations';
import DeleteFriendDialog from '@/components/FriendButtons/DeleteFriendButton/DeleteFriendDialog';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { IFriendRequestDataType, IUserDataType } from '@/lib/types/interfaces';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import LoadingButton from '@/components/LoadingButton';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface IProps {
  userId: UUID;
  /**
   * Optional pre-fetched user data (with friend status). When provided the
   * component avoids an extra request and uses it directly, otherwise it
   * fetches the user info itself - just like FollowButton.
   */
  userData?: (IUserDataType & { friend?: IFriendRequestDataType | null }) | null;
  className?: string;
  asMenuItem?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  hiddenLabel?: boolean;
  addFriendLabel?: string;
  pendingLabel?: string;
  respondLabel?: string;
  friendLabel?: string;
}

/**
 * FriendButton - reusable friendship button (mirrors FollowButton).
 *
 * It owns the friend status + logic so it can be dropped in anywhere:
 * - Fetches the friend status from the user info query (or uses `userData`).
 * - Handles every state: none / pending sent / pending received / friends.
 * - Sending, cancelling and accepting a request go through the smart toggle
 *   endpoint; unfriending opens a confirmation dialog.
 * - Renders as a normal button or as a dropdown menu item (`asMenuItem`).
 */
export default function FriendButton({
  userId,
  userData,
  className,
  asMenuItem = false,
  variant = 'secondary',
  size = 'default',
  hiddenLabel = false,
  addFriendLabel = 'Add friend',
  pendingLabel = 'Cancel request',
  respondLabel = 'Accept',
  friendLabel = 'Friends',
}: IProps) {
  const { user: currentUser } = useAppSelector(selectAuth);
  const [isUnfriendOpen, setIsUnfriendOpen] = useState(false);

  // Only fetch when caller didn't hand us the data already.
  const { data: fetchedUserInfo } = useGetUserInfomation({ userId }, { enabled: !userData });

  const userInfo = userData ?? fetchedUserInfo;
  const toggleFriendship = useToggleFriendshipRequestMutation({ userId });

  const friend = userInfo?.friend as IFriendRequestDataType | null | undefined;
  const status = friend?.status;
  const isFriend = status === 'ACCEPTED';
  const isPending = status === 'PENDING';
  // The request row stores the sender in `userId`. If that's me, I sent it.
  const isSentByMe = friend?.userId
    ? friend.userId === currentUser?.id
    : (friend?.isRequestedByMe ?? true);

  const isLoading = toggleFriendship.isPending;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFriendship.mutateAsync();
    } catch (error) {
      console.error('Failed to toggle friendship:', error);
    }
  };

  const openUnfriend = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUnfriendOpen(true);
  };

  // Don't render anything for yourself or while we have no data to act on.
  if (!userInfo || (currentUser && currentUser.id === userId)) return null;

  // ----- Dropdown menu item rendering -----
  if (asMenuItem) {
    if (isFriend) {
      return (
        <>
          <DropdownMenuItem
            onClick={openUnfriend}
            onSelect={(e) => e.preventDefault()}
            className={cn(
              'flex items-center h-10 gap-x-4 cursor-pointer text-destructive',
              className,
            )}
          >
            <UserMinus className='!size-5 text-destructive' />
            {hiddenLabel ? '' : 'Unfriend'}
          </DropdownMenuItem>
          <DeleteFriendDialog
            userData={userInfo}
            isOpen={isUnfriendOpen}
            onClose={() => setIsUnfriendOpen(false)}
          />
        </>
      );
    }

    if (isPending && !isSentByMe) {
      return (
        <DropdownMenuItem
          onClick={handleToggle}
          onSelect={(e) => e.preventDefault()}
          disabled={isLoading}
          className={cn('flex items-center h-10 gap-x-4 cursor-pointer', className)}
        >
          <Check className='!size-5 text-primary' />
          {isLoading ? 'Processing...' : respondLabel}
        </DropdownMenuItem>
      );
    }

    if (isPending) {
      return (
        <DropdownMenuItem
          onClick={handleToggle}
          onSelect={(e) => e.preventDefault()}
          disabled={isLoading}
          className={cn('flex items-center h-10 gap-x-4 cursor-pointer', className)}
        >
          <Clock className='!size-5 text-primary' />
          {isLoading ? 'Processing...' : pendingLabel}
        </DropdownMenuItem>
      );
    }

    return (
      <DropdownMenuItem
        onClick={handleToggle}
        onSelect={(e) => e.preventDefault()}
        disabled={isLoading}
        className={cn('flex items-center h-10 gap-x-4 cursor-pointer', className)}
      >
        <UserPlus className='!size-5 text-primary' />
        {isLoading ? 'Sending...' : addFriendLabel}
      </DropdownMenuItem>
    );
  }

  // ----- Regular button rendering -----
  // State: already friends -> open unfriend confirmation
  if (isFriend) {
    return (
      <>
        <Button
          variant={variant === 'secondary' ? 'outline' : variant}
          size={size}
          className={cn('gap-2', className)}
          onClick={openUnfriend}
        >
          <UserCheck className='w-4 h-4' />
          {hiddenLabel ? '' : friendLabel}
        </Button>
        <DeleteFriendDialog
          userData={userInfo}
          isOpen={isUnfriendOpen}
          onClose={() => setIsUnfriendOpen(false)}
        />
      </>
    );
  }

  // State: pending request received -> accept
  if (isPending && !isSentByMe) {
    return (
      <LoadingButton
        size={size}
        className={cn('gap-2 text-white', className)}
        onClick={handleToggle}
        loading={isLoading}
      >
        {!isLoading && <Check className='w-4 h-4' />}
        {hiddenLabel ? '' : respondLabel}
      </LoadingButton>
    );
  }

  // State: pending request sent -> cancel
  if (isPending) {
    return (
      <LoadingButton
        size={size}
        variant='outline'
        className={cn('gap-2', className)}
        onClick={handleToggle}
        loading={isLoading}
      >
        {!isLoading && <Clock className='w-4 h-4' />}
        {hiddenLabel ? '' : pendingLabel}
      </LoadingButton>
    );
  }

  // State: no relationship -> send request
  return (
    <LoadingButton
      size={size}
      variant={variant}
      className={cn('gap-2', className)}
      onClick={handleToggle}
      loading={isLoading}
    >
      {!isLoading && <UserPlus className='w-4 h-4' />}
      {hiddenLabel ? '' : addFriendLabel}
    </LoadingButton>
  );
}
