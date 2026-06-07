import Followers from '@/components/Followers';
import Followings from '@/components/Followings';
import { useProfileContext } from '@/hooks/useProfileContext';
import FriendList from '@/modules/profile/components/Profile/ProfileContent/FriendList';
import ProfileInfo from '@/modules/profile/components/Profile/ProfileContent/ProfileInfo';

export default function LeftSidebar() {
  const { userData } = useProfileContext();
  return (
    <div className='space-y-4 w-full lg:max-w-sm xl:max-w-md shrink-0'>
      <ProfileInfo />
      <Followers userId={userData.id} />
      <Followings userId={userData.id} />
      <FriendList />
    </div>
  );
}
