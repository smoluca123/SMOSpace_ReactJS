import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserAvatar from '@/components/UserAvatar';
import { useProfileContext } from '@/hooks/useProfileContext';
import { UpdateAvatarDialog } from '@/modules/profile/components/Profile/ProfileHeader/ProfileAvatarImage/UpdateAvatar';
import { Pencil, Upload } from 'lucide-react';
import { useState } from 'react';

export default function ProfileAvatarImage() {
  const { userData, isMe } = useProfileContext();

  return (
    <div className='relative p-1 rounded-full drop-shadow-lg shrink-0 bg-background group'>
      <UserAvatar
        userId={userData.id}
        className='size-20 sm:size-28 lg:size-40'
        avatarUrl={userData.avatar}
      />

      {/* overlay */}
      {isMe && (
        <div className='flex absolute inset-0 justify-center items-center rounded-full opacity-0 transition-opacity duration-300 bg-black/50 group-hover:opacity-100'>
          <EditAvatarButton />
        </div>
      )}
    </div>
  );
}

function EditAvatarButton() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { userData } = useProfileContext();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Pencil className='w-5 h-5 text-primary' />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className='text-center'>Update Avatar</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className='space-y-1'>
            <DropdownMenuItem
              className='text-center cursor-pointer'
              onClick={() => setIsEditOpen(true)}
            >
              <div className='flex gap-2 justify-center items-center w-full'>
                <Pencil className='w-5 h-5 text-primary' />
                Edit
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-center cursor-pointer'
              onClick={() => setIsUploadOpen(true)}
            >
              <div className='flex gap-2 justify-center items-center w-full'>
                <Upload className='w-5 h-5 text-primary' />
                Upload
              </div>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Avatar Dialog */}
      <UpdateAvatarDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        userData={userData}
        mode='edit'
      />

      {/* Upload Avatar Dialog */}
      <UpdateAvatarDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        userData={userData}
        mode='upload'
      />
    </>
  );
}
