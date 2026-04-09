import { UUID } from 'crypto';
import { Button } from '@/components/ui/button';
import { UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface IProps {
  userId: UUID;
  className?: string;
  addFriendLabel?: string;
  friendLabel?: string;
}

export default function FriendButton({
  userId,
  className,
  addFriendLabel = 'Thêm bạn bè',
  friendLabel = 'Bạn bè',
}: IProps) {
  // TODO: Get actual friend status from API/context using useGetUserInfomation
  const [isFriend, setIsFriend] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleAddFriend = async () => {
    setIsPending(true);
    try {
      // TODO: Call API to send friend request
      console.log('Add friend:', userId);
      setIsFriend(true);
    } catch (error) {
      console.error('Failed to add friend:', error);
    } finally {
      setIsPending(false);
    }
  };

  const handleUnfriend = async () => {
    setIsPending(true);
    try {
      // TODO: Call API to unfriend user
      console.log('Unfriend:', userId);
      setIsFriend(false);
    } catch (error) {
      console.error('Failed to unfriend:', error);
    } finally {
      setIsPending(false);
    }
  };

  if (isFriend) {
    return (
      <Button
        variant='secondary'
        className={cn('gap-2', className)}
        onClick={handleUnfriend}
        disabled={isPending}
      >
        <Users className='h-4 w-4' />
        {friendLabel}
      </Button>
    );
  }

  return (
    <Button
      variant='secondary'
      className={cn('gap-2', className)}
      onClick={handleAddFriend}
      disabled={isPending}
    >
      <UserPlus className='h-4 w-4' />
      {addFriendLabel}
    </Button>
  );
}
