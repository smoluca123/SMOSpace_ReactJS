import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IUserDataType } from '@/lib/types/interfaces';
import UpdateAvatarForm from '@/modules/profile/components/Profile/ProfileHeader/ProfileAvatarImage/UpdateAvatar/UpdateAvatarForm';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  userData: IUserDataType;
}

export default function UpdateProfileAvatarDialog({ isOpen, onClose, userData }: IProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </DialogDescription>
        </DialogHeader>

        <UpdateAvatarForm userData={userData} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
