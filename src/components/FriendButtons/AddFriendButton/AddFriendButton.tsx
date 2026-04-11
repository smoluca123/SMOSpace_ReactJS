'use no memo';
import { UUID } from 'crypto';
import { UserPlus, UserCheck, Clock, UserMinus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToggleFriendshipRequestMutation } from './mutations';
import { IUserDataTypeWithFriendStatus } from '@/lib/types/interfaces';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface IProps {
  userId: UUID;
  userData?: IUserDataTypeWithFriendStatus;
  className?: string;
  asMenuItem?: boolean;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * AddFriendButton - Smart friend request button with automatic status detection
 *
 * Features:
 * - Automatically detects friend status from userData.friend
 * - Handles 3 states: No relationship, Pending (sent), Friends
 * - Optimistic updates with automatic cache invalidation
 * - Can render as button or dropdown menu item
 * - Reusable across the app
 *
 * Usage:
 * ```tsx
 * // As button
 * <AddFriendButton userId={user.id} userData={user} />
 *
 * // As menu item
 * <AddFriendButton userId={user.id} userData={user} asMenuItem />
 * ```
 */
export default function AddFriendButton({
  userId,
  userData,
  className,
  asMenuItem = false,
  variant = 'secondary',
  size = 'default',
}: IProps) {
  const toggleFriendshipMutation = useToggleFriendshipRequestMutation({ userId });

  // Determine friend status from userData
  const friendStatus = userData?.friend?.status;
  const isFriend = friendStatus === 'ACCEPTED';
  const isPendingRequest = friendStatus === 'PENDING';

  const handleToggleFriendship = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await toggleFriendshipMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to toggle friendship:', error);
    }
  };

  const isLoading = toggleFriendshipMutation.isPending;

  // Render as dropdown menu item
  if (asMenuItem) {
    // State 1: Already friends
    if (isFriend) {
      return (
        <DropdownMenuItem
          onClick={handleToggleFriendship}
          disabled={isLoading}
          className={cn(
            'flex items-center h-10 gap-x-4 cursor-pointer text-destructive',
            className,
          )}
        >
          <UserMinus className='!size-5 text-destructive' />
          {isLoading ? 'Đang xử lý...' : 'Hủy kết bạn'}
        </DropdownMenuItem>
      );
    }

    // State 2: Pending request
    if (isPendingRequest) {
      return (
        <DropdownMenuItem
          onClick={handleToggleFriendship}
          disabled={isLoading}
          className={cn('flex items-center h-10 gap-x-4 cursor-pointer', className)}
        >
          <Clock className='!size-5 text-primary' />
          {isLoading ? 'Đang xử lý...' : 'Hủy lời mời'}
        </DropdownMenuItem>
      );
    }

    // State 3: No relationship
    return (
      <DropdownMenuItem
        onClick={handleToggleFriendship}
        disabled={isLoading}
        className={cn('flex items-center h-10 gap-x-4 cursor-pointer', className)}
      >
        <UserPlus className='!size-5 text-primary' />
        {isLoading ? 'Đang gửi...' : 'Thêm bạn bè'}
      </DropdownMenuItem>
    );
  }

  // Render as regular button
  // State 1: Already friends
  if (isFriend) {
    return (
      <Button
        variant={variant === 'secondary' ? 'outline' : variant}
        size={size}
        className={cn('gap-2', className)}
        onClick={handleToggleFriendship}
        disabled={isLoading}
      >
        {isLoading ? (
          <>Đang xử lý...</>
        ) : (
          <>
            <UserCheck className='h-4 w-4' />
            Bạn bè
          </>
        )}
      </Button>
    );
  }

  // State 2: Pending request
  if (isPendingRequest) {
    return (
      <Button
        variant='outline'
        size={size}
        className={cn('gap-2', className)}
        onClick={handleToggleFriendship}
        disabled={isLoading}
      >
        {isLoading ? (
          <>Đang hủy...</>
        ) : (
          <>
            <Clock className='h-4 w-4' />
            Hủy lời mời
          </>
        )}
      </Button>
    );
  }

  // State 3: No relationship
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
      onClick={handleToggleFriendship}
      disabled={isLoading}
    >
      {isLoading ? (
        <>Đang gửi...</>
      ) : (
        <>
          <UserPlus className='h-4 w-4' />
          Thêm bạn bè
        </>
      )}
    </Button>
  );
}
