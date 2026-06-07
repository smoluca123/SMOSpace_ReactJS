import { UUID } from 'crypto';
import { Loader2, UserPlus, UserX } from 'lucide-react';
import DropdownMenuItemWithIcon from '@/components/DropdownMenuItemWithIcon';
import { useGetUserInfomation } from '@/lib/querys';
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from '@/components/FollowButton/mutations';
import { cn } from '@/lib/utils';

interface IProps {
  userId: UUID;
}

export default function ToggleFollowMenuItem({ userId }: IProps) {
  const { data: userInfo, isFetching: isFetchingUserInfo } = useGetUserInfomation({ userId });
  const { mutate: followUser, isPending: isPendingFollow } = useFollowUserMutation({ userId });
  const { mutate: unfollowUser, isPending: isPendingUnfollow } = useUnfollowUserMutation({
    userId,
  });

  const handleToggleFollow = () => {
    if (!userInfo) return;
    if (userInfo.isFollowedByUser) {
      unfollowUser();
    } else {
      followUser();
    }
  };

  if (!userInfo && !isFetchingUserInfo) return null;

  return (
    <>
      {isFetchingUserInfo && (
        <DropdownMenuItemWithIcon>
          {' '}
          <Loader2 className='animate-spin' /> Loading...
        </DropdownMenuItemWithIcon>
      )}
      {userInfo && (
        <DropdownMenuItemWithIcon
          Icon={userInfo.isFollowedByUser ? UserX : UserPlus}
          onClick={handleToggleFollow}
          onSelect={(e) => e.preventDefault()}
          disabled={isPendingFollow || isPendingUnfollow}
          className={cn('', {
            'text-primary': userInfo.isFollowedByUser,
          })}
        >
          {userInfo.isFollowedByUser ? 'Unfollow' : 'Follow'}
          {(isPendingFollow || isPendingUnfollow) && <Loader2 className='animate-spin' />}
        </DropdownMenuItemWithIcon>
      )}
    </>
  );
}
