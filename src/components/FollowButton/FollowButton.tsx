import { UserMinus, UserPlus } from 'lucide-react';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import { useFollowUserMutation } from './mutations';
import { useGetUserInfomation } from '@/lib/querys';
import LoadingButton from '../LoadingButton';

export default function FollowButton({ user }: { user: IUserDataWithFollowedStatusType }) {
  const { data: userInfo } = useGetUserInfomation({ userId: user.id });
  const { mutate, isPending } = useFollowUserMutation({ userId: user.id });

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
            className='text-white'
          >
            {!isPending && <UserMinus />}
            Unfollow
          </LoadingButton>
        )}

        {/* Follow button */}
        {!userInfo.isFollowedByUser && (
          <LoadingButton
            onClick={handleToggleFollowUser}
            className='text-foreground'
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
