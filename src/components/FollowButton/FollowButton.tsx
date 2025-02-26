import { Loader2, UserMinus, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import { useFollowUserMutation } from './mutations';

export default function FollowButton({ user }: { user: IUserDataWithFollowedStatusType }) {
  const { mutate, isPending } = useFollowUserMutation({ userId: user.id });

  const handleToggleFollowUser = () => {
    mutate();
  };

  return (
    <>
      {user.isFollowedByUser && !isPending && (
        <Button onClick={handleToggleFollowUser} className='text-white'>
          <UserMinus />
          Unfollow
        </Button>
      )}
      {!user.isFollowedByUser && !isPending && (
        <Button onClick={handleToggleFollowUser} className='text-foreground' variant='secondary'>
          <UserPlus />
          Follow
        </Button>
      )}
      {isPending && (
        <Button disabled>
          <Loader2 className=' animate-spin' />
        </Button>
      )}
    </>
  );
}
