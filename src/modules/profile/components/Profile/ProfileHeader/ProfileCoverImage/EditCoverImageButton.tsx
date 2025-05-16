import { Button } from '@/components/ui/button';
import { useProfileContext } from '@/hooks/useProfileContext';
import { UpdateCoverDialog } from '@/modules/profile/components/Profile/ProfileHeader/ProfileCoverImage';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

export default function EditCoverImageButton() {
  const { userData, isMe } = useProfileContext();
  const [isOpenUpdateCoverDialog, setIsOpenUpdateCoverDialog] = useState(false);
  return (
    <>
      {isMe && (
        <div>
          <Button
            variant='outline'
            className='gap-2'
            onClick={() => setIsOpenUpdateCoverDialog(true)}
          >
            <Pencil className='w-4 h-4 text-primary' />
            Edit
          </Button>

          <UpdateCoverDialog
            isOpen={isOpenUpdateCoverDialog}
            onClose={() => setIsOpenUpdateCoverDialog(false)}
            userData={userData}
          />
        </div>
      )}
    </>
  );
}
