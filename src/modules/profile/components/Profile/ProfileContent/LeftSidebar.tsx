import Followers from '@/components/Followers';
import Followings from '@/components/Followings';
import { useProfileContext } from '@/hooks/useProfileContext';
import ProfileInfo from '@/modules/profile/components/Profile/ProfileContent/ProfileInfo';

export default function LeftSidebar() {
  const { userData } = useProfileContext();
  return (
    <div className='space-y-4 w-full max-w-sm'>
      <ProfileInfo />
      <Followers userId={userData.id} />
      <Followings userId={userData.id} />
    </div>
  );
}
