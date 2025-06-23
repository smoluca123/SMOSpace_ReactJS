import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import { useAdminToggleBanUserMutation } from '../../mutations';
import LoadingButton from '@/components/LoadingButton';
import { SetStateAction } from 'react';

export default function TogglebanUserDialog({
  selectedUser,
  onClose,
  open,
  setSelectedUser,
}: {
  selectedUser: IUserDataWithFollowedStatusType | null;
  setSelectedUser: React.Dispatch<SetStateAction<IUserDataWithFollowedStatusType | null>>;
  open: boolean;
  onClose: () => void;
}) {
  const { mutate, isPending } = useAdminToggleBanUserMutation();
  if (!selectedUser) return;

  const handleCloseDialog = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const toggleBanUser = () => {
    mutate(
      {
        userId: selectedUser?.id,
        isBanned: !selectedUser?.isBanned,
      },
      {
        onSuccess: () => {
          setSelectedUser(null);
          onClose();
        },
      },
    );
  };

  if (!selectedUser) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent>
        <DialogHeader>
          {selectedUser.isBanned && <DialogTitle>Unban User</DialogTitle>}
          {!selectedUser.isBanned && <DialogTitle>Ban User</DialogTitle>}
          <DialogDescription>
            Are you sure you want to {`${selectedUser.isBanned ? 'unban' : 'ban'}`} this user? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {selectedUser && (
          <div className='py-4'>
            <p className='text-sm text-muted-foreground'>
              You are about to change <strong>{selectedUser.fullName}</strong> ({selectedUser.email}
              )
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant='outline' onClick={() => onClose()}>
            Cancel
          </Button>
          <LoadingButton
            loading={isPending}
            variant={selectedUser.isBanned ? 'default' : 'destructive'}
            onClick={toggleBanUser}
          >
            {selectedUser.isBanned ? 'Unban User' : 'Ban User'}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
