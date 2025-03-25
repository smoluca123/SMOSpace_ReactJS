import UserAvatar from '@/components/UserAvatar';
import { useProfileContext } from '@/hooks/useProfileContext';
import { UpdateAvatarDialog } from '@/modules/profile/components/Profile/ProfileHeader/ProfileAvatarImage/UpdateAvatar';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

export default function ProfileAvatarImage() {
  const [isOpen, setIsOpen] = useState(false);
  const { userData, isMe } = useProfileContext();

  return (
    <div className='relative p-1 rounded-full drop-shadow-lg bg-background group'>
      <UserAvatar className='size-40' avatarUrl={userData.avatar} />

      {/* overlay */}
      {isMe && (
        <div className='flex absolute inset-0 justify-center items-center rounded-full opacity-0 transition-opacity duration-300 bg-black/50 group-hover:opacity-100'>
          <div className='cursor-pointer' onClick={() => setIsOpen(true)}>
            <Pencil className='w-5 h-5 text-primary' />
          </div>
        </div>
      )}

      <UpdateAvatarDialog isOpen={isOpen} onClose={() => setIsOpen(false)} userData={userData} />
    </div>
  );
}
