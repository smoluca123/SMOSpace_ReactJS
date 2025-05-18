import LoadingButton from '@/components/LoadingButton';
import { toast } from '@/hooks/use-toast';
import useFriendRequestContext from '@/hooks/useFriendRequestContext';
import { useCancelFriendRequest } from '@/modules/friends/components/FriendRequestButtons/mutations';

export default function CancelRequestButton() {
  const { friendRequest } = useFriendRequestContext();
  const { mutate, isPending } = useCancelFriendRequest();
  const handleCancelFriendRequest = () => {
    mutate(
      { userId: friendRequest.friend.id },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Friend request cancelled',
            duration: 3000,
          });
        },
      },
    );
  };
  return (
    <LoadingButton
      className='w-full hover:bg-muted-foreground/20 bg-muted-foreground/30 text-foreground'
      onClick={handleCancelFriendRequest}
      loading={isPending}
    >
      Cancel
    </LoadingButton>
  );
}
