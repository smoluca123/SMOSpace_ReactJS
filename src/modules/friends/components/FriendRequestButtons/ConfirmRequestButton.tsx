import LoadingButton from '@/components/LoadingButton';
import { toast } from '@/hooks/use-toast';
import useFriendRequestContext from '@/hooks/useFriendRequestContext';
import { useAcceptFriendRequest } from '@/modules/friends/components/FriendRequestButtons/mutations';

export default function ConfirmRequestButton() {
  const { friendRequest } = useFriendRequestContext();
  const { mutate, isPending } = useAcceptFriendRequest();
  const handleAcceptFriendRequest = () => {
    mutate(
      {
        userId: friendRequest.friend.id,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Friend request accepted',
            duration: 3000,
          });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to accept friend request',
            variant: 'destructive',
            duration: 3000,
          });
        },
      },
    );
  };
  return (
    <LoadingButton
      className='w-full text-white'
      onClick={handleAcceptFriendRequest}
      loading={isPending}
    >
      Confirm
    </LoadingButton>
  );
}
