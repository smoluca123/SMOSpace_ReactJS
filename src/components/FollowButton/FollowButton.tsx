import { UserMinus, UserPlus } from 'lucide-react';
import { useFollowUserMutation } from './mutations';
import { useGetUserInfomation } from '@/lib/querys';
import LoadingButton from '../LoadingButton';
import { cn } from '@/lib/utils';
import { UUID } from 'crypto';

export default function FollowButton({ userId, className }: { userId: UUID; className?: string }) {
  const { data: userInfo } = useGetUserInfomation({ userId });
  const { mutate, isPending } = useFollowUserMutation({ userId });

  const handleToggleFollowUser = () => {
    mutate();
  };

  return (
    userInfo && (
      <>
        {/* Unfollow button */}
        {userInfo.isFollowedByUser && (
          <LoadingButton
            loading={isPending}
            onClick={handleToggleFollowUser}
            className={cn('text-white', className)}
          >
            {!isPending && <UserMinus />}
            Unfollow
          </LoadingButton>
        )}

        {/* Follow button */}
        {!userInfo.isFollowedByUser && (
          <LoadingButton
            onClick={handleToggleFollowUser}
            className={cn('text-foreground', className)}
            variant='secondary'
            loading={isPending}
          >
            {!isPending && <UserPlus />}
            Follow
          </LoadingButton>
        )}
      </>
    )
  );
}
