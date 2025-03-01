import { ProfileCoverImage } from '@/modules/profile/components/Profile/ProfileHeader';
import ProfileAvatarImage from '@/modules/profile/components/Profile/ProfileHeader/ProfileAvatarImage';

export default function ProfileHeader() {
  return (
    <div>
      <div className='relative'>
        <ProfileCoverImage />

        {/* Avatar */}
        <div className='absolute bottom-10 left-10'>
          <ProfileAvatarImage />
        </div>
      </div>
    </div>
  );
}
