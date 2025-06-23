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
import { useAdminToggleBanUsersMutaion } from '../../mutations';
import LoadingButton from '@/components/LoadingButton';
import { SetStateAction } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  selectedUsers: IUserDataWithFollowedStatusType[];
  setSelectedUsers: React.Dispatch<SetStateAction<IUserDataWithFollowedStatusType[] | []>>;
};

export default function MultipleToggleBanUserDialog({
  open,
  onClose,
  selectedUsers,
  setSelectedUsers,
}: Props) {
  const { mutate, isPending } = useAdminToggleBanUsersMutaion();

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  const handleToggleBan = (mode: 'ban' | 'unBan') => {
    const payload = selectedUsers.map((user) => ({
      userId: user.id,
      isBanned: mode === 'ban',
    }));

    mutate(payload);
    onClose();
    setSelectedUsers([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage User Ban Status</DialogTitle>
          <DialogDescription>
            <div className='mb-2'>
              You have selected <strong>{selectedUsers.length}</strong> user
              {selectedUsers.length > 1 ? 's' : ''}.
            </div>
            This action will change their ban status. <br />
            <span className='text-red-500 font-medium'>This cannot be undone.</span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={isPending}
            variant='destructive'
            onClick={() => handleToggleBan('ban')}
          >
            Ban All ({selectedUsers.length})
          </LoadingButton>
          <LoadingButton loading={isPending} onClick={() => handleToggleBan('unBan')}>
            Unban All ({selectedUsers.length})
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
