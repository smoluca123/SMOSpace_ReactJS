import { useDeleteFriend } from '@/components/FriendButtons/DeleteFriendButton/mutations';
import LoadingButton from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { IUserDataType } from '@/lib/types/interfaces';

interface IProps {
  userData: IUserDataType;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteFriendDialog({ userData, isOpen, onClose }: IProps) {
  const { mutate, isPending } = useDeleteFriend();
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleDeleteFriend = () => {
    mutate(
      { userId: userData.id },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Friend deleted successfully',
            duration: 3000,
          });
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unfriend {userData.fullName}. Are you sure? </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton variant='destructive' onClick={handleDeleteFriend} loading={isPending}>
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
