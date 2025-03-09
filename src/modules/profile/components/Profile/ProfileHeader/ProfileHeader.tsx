import NameWithBadge from '@/components/NameWithBadge';
import NameWithVerifiedIcon from '@/components/NameWithVerifiedIcon';
import { useProfileContext } from '@/hooks/useProfileContext';
import { ProfileCoverImage } from '@/modules/profile/components/Profile/ProfileHeader';
import { EditProfileButton } from '@/modules/profile/components/Profile/ProfileHeader/EditProfile';
import ProfileAvatarImage from '@/modules/profile/components/Profile/ProfileHeader/ProfileAvatarImage';

export default function ProfileHeader() {
  const { userData, isMe } = useProfileContext();

  return (
    <div>
      <div className='relative'>
        <ProfileCoverImage />

        {/* Avatar */}
        <div className='absolute bottom-10 left-10'>
          <div className='flex gap-2 items-center'>
            <ProfileAvatarImage />
            <div className='flex flex-col'>
              <NameWithBadge userData={userData}>
                <NameWithVerifiedIcon isVerified={userData.isVerified}>
                  <p className='text-2xl font-medium text-white text-shadow-sm'>
                    {userData.fullName}
                  </p>
                </NameWithVerifiedIcon>
              </NameWithBadge>
              <p className='text-sm text-white text-muted-foreground text-shadow-sm'>
                @{userData.username}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        {isMe && (
          <div className='absolute right-10 bottom-10'>
            <EditProfileButton />
          </div>
        )}
      </div>
    </div>
  );
}
