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
  mode: 'edit' | 'upload';
}

export default function UpdateProfileAvatarDialog({ isOpen, onClose, userData, mode }: IProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const dialogTitle = mode === 'edit' ? 'Edit avatar' : 'Upload new avatar';
  const dialogDescription =
    mode === 'edit'
      ? 'Edit your current avatar to make adjustments.'
      : 'Upload a new avatar to make your profile more personalized. Drag and drop your image here or click to upload.';

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <UpdateAvatarForm
          userData={userData}
          onClose={onClose}
          mode={mode}
          initialImage={mode === 'edit' ? userData.avatar : undefined}
        />
      </DialogContent>
    </Dialog>
  );
}
