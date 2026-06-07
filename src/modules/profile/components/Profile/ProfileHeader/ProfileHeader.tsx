import NameWithBadge from '@/components/NameWithBadge';
import NameWithVerifiedIcon from '@/components/NameWithVerifiedIcon';
import { useProfileContext } from '@/hooks/useProfileContext';
import { ProfileCoverImage } from '@/modules/profile/components/Profile/ProfileHeader';
import ProfileActions from '@/modules/profile/components/Profile/ProfileHeader/ProfileActions';
import ProfileAvatarImage from '@/modules/profile/components/Profile/ProfileHeader/ProfileAvatarImage';
import { EditCoverImageButton } from '@/modules/profile/components/Profile/ProfileHeader/ProfileCoverImage';

export default function ProfileHeader() {
  const { userData, isMe } = useProfileContext();

  return (
    <div className='relative'>
      <ProfileCoverImage />

      {/* Action buttons – top-right on mobile, bottom-right on desktop */}
      <div className='flex absolute top-3 right-3 gap-2 flex-wrap justify-end sm:top-4 sm:right-4 lg:top-auto lg:bottom-10 lg:right-10'>
        {isMe && <EditCoverImageButton />}
        <ProfileHeaderActions />
      </div>

      {/* Avatar + name – stays anchored to the cover bottom-left, scales down on small screens */}
      <div className='flex absolute right-3 bottom-3 left-3 gap-3 items-end sm:right-auto sm:bottom-6 sm:left-6 lg:bottom-10 lg:left-10 lg:items-center'>
        <ProfileAvatarImage />
        <div className='flex flex-col mb-1 min-w-0 lg:mb-0'>
          <NameWithBadge userData={userData}>
            <NameWithVerifiedIcon isVerified={userData.isVerified}>
              <p className='text-base font-medium text-white truncate sm:text-lg lg:text-2xl text-shadow-sm'>
                {userData.fullName}
              </p>
            </NameWithVerifiedIcon>
          </NameWithBadge>
          <p className='text-xs text-white truncate sm:text-sm text-muted-foreground text-shadow-sm'>
            @{userData.username}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProfileHeaderActions() {
  const { userData, isMe } = useProfileContext();

  if (!userData || isMe) return null;

  return <ProfileActions userId={userData.id} />;
}
