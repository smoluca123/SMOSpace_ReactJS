'use client';

import { UUID } from 'crypto';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck } from 'lucide-react';
import { useState } from 'react';

interface IProps {
  userId: UUID;
  className?: string;
}

export default function AddFriendButton({ userId, className }: IProps) {
  // TODO: Replace with actual friend request mutation and user data
  const [isFriend, setIsFriend] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleAddFriend = async () => {
    setIsPending(true);
    try {
      // TODO: Call API to send friend request
      // await sendFriendRequest(userId);
      console.log('Add friend:', userId);
      setIsFriend(true);
    } catch (error) {
      console.error('Failed to add friend:', error);
    } finally {
      setIsPending(false);
    }
  };

  const handleCancelRequest = async () => {
    setIsPending(true);
    try {
      // TODO: Call API to cancel friend request
      // await cancelFriendRequest(userId);
      console.log('Cancel friend request:', userId);
      setIsFriend(false);
    } catch (error) {
      console.error('Failed to cancel request:', error);
    } finally {
      setIsPending(false);
    }
  };

  if (isFriend) {
    return (
      <Button
        variant='secondary'
        className={className}
        onClick={handleCancelRequest}
        disabled={isPending}
      >
        <UserCheck className='w-4 h-4' />
        Friend Request Sent
      </Button>
    );
  }

  return (
    <Button variant='default' className={className} onClick={handleAddFriend} disabled={isPending}>
      <UserPlus className='w-4 h-4' />
      Add Friend
    </Button>
  );
}
