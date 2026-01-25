import { UserMinus, UserPlus } from 'lucide-react';
import { useFollowUserMutation, useUnfollowUserMutation } from './mutations';
import { useGetUserInfomation } from '@/lib/querys';
import LoadingButton from '../LoadingButton';
import { cn } from '@/lib/utils';
import { UUID } from 'crypto';

interface IProps {
  userId: UUID;
  className?: string;
  followLabel?: string;
  unfollowLabel?: string;
  hiddenLabel?: boolean;
}

export default function FollowButton({
  userId,
  className,
  followLabel,
  unfollowLabel,
  hiddenLabel,
}: IProps) {
  const { data: userInfo } = useGetUserInfomation({ userId });
  const { mutate: followUser, isPending: isFollowPending } = useFollowUserMutation({ userId });
  const { mutate: unfollowUser, isPending: isUnfollowPending } = useUnfollowUserMutation({
    userId,
  });

  const handleToggleFollowUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userInfo) return;
    if (userInfo.isFollowedByUser) {
      unfollowUser();
    } else {
      followUser();
    }
  };
  return (
    userInfo && (
      <>
        {/* Unfollow button */}
        {userInfo.isFollowedByUser && (
          <LoadingButton
            loading={isUnfollowPending}
            onClick={handleToggleFollowUser}
            className={cn('text-white', className)}
          >
            {!isUnfollowPending && <UserMinus />}
            {hiddenLabel ? '' : unfollowLabel || 'Unfollow'}
          </LoadingButton>
        )}

        {/* Follow button */}
        {!userInfo.isFollowedByUser && (
          <LoadingButton
            onClick={handleToggleFollowUser}
            className={cn('text-foreground', className)}
            variant='secondary'
            loading={isFollowPending}
          >
            {!isFollowPending && <UserPlus />}
            {hiddenLabel ? '' : followLabel || 'Follow'}
          </LoadingButton>
        )}
      </>
    )
  );
}
