import UserAvatar from '@/components/UserAvatar';
import { useProfileContext } from '@/hooks/useProfileContext';

export default function ProfileAvatarImage() {
  const { userData } = useProfileContext();

  return (
    <div className='p-1 rounded-full drop-shadow-lg bg-background'>
      <UserAvatar className='size-40' avatarUrl={userData.avatar} />
    </div>
  );
}
