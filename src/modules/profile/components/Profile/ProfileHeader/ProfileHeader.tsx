import NameWithBadge from '@/components/NameWithBadge';
import NameWithVerifiedIcon from '@/components/NameWithVerifiedIcon';
import { useProfileContext } from '@/hooks/useProfileContext';
import { useGetFriendByUserId } from '@/lib/querys';
import { ProfileCoverImage } from '@/modules/profile/components/Profile/ProfileHeader';
import ProfileActions from '@/modules/profile/components/Profile/ProfileHeader/ProfileActions';
import ProfileAvatarImage from '@/modules/profile/components/Profile/ProfileHeader/ProfileAvatarImage';
import { EditCoverImageButton } from '@/modules/profile/components/Profile/ProfileHeader/ProfileCoverImage';

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
        <div className='flex absolute right-10 bottom-10 gap-4'>
          {isMe && <EditCoverImageButton />}
          <ProfileHeaderActions />
        </div>
      </div>
    </div>
  );
}

export function ProfileHeaderActions() {
  const { userData, isMe } = useProfileContext();
  const { isSuccess, data } = useGetFriendByUserId(
    { userId: userData.id },
    {
      enabled: !isMe,
    },
  );
  const isFriend = isSuccess && !!data;
  if (!userData) return null;
  return <>{!isMe && isFriend && <ProfileActions />}</>;
}
