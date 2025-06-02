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

export default function DeleteUserDialog({
  selectedUser,
  onClose,
  open,
}: {
  selectedUser: IUserDataWithFollowedStatusType | null;
  open: boolean;
  onClose: () => void;
}) {
  const handleCloseDialog = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const handleDeleteUser = () => {
    console.log(123);
  };

  if (!selectedUser) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {selectedUser && (
          <div className='py-4'>
            <p className='text-sm text-muted-foreground'>
              You are about to delete <strong>{selectedUser.fullName}</strong> ({selectedUser.email}
              )
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant='outline' onClick={() => onClose()}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDeleteUser}>
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
