import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IUserDataType } from '@/lib/types/interfaces';

import UpdateProfileCoverForm from '@/modules/profile/components/Profile/ProfileHeader/ProfileCoverImage/UpdateCover/UpdateProfileCoverForm';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  userData: IUserDataType;
}

export default function UpdateProfileCoverDialog({ isOpen, onClose, userData }: IProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Update avatar</DialogTitle>
          <DialogDescription>
            Update your avatar to make your profile more personalized. Drag and drop your image here
            or click to upload.
          </DialogDescription>
        </DialogHeader>

        <UpdateProfileCoverForm userData={userData} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
