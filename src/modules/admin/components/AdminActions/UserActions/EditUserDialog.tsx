import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import EditUserInfomationForm from './EditUserInfomationForm';

export default function EditUserDialog({
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

  if (!selectedUser) return null;

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className='overflow-y-auto max-h-[700px] min-w-5xl max-w-5xl'>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information</DialogDescription>
        </DialogHeader>
        <EditUserInfomationForm onClose={onClose} user={selectedUser} />
      </DialogContent>
    </Dialog>
  );
}
