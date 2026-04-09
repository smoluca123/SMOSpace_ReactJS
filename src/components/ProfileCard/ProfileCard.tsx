'use client';
import UserAvatar from '../UserAvatar';
import { MessageCircle } from 'lucide-react';
import { UUID } from 'crypto';
import { Button } from '../ui/button';
import ProfileLink from '../ProfileLink';
import { Separator } from '../ui/separator';

import FollowButton from '../FollowButton';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useGetUserInfomation } from '@/lib/querys';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import UserAdditionalInfo from '../UserAdditionalInfo';
import UserMetaData from '../UserMetaData';
import ProfileCardProvider from './ProfileCardProvider';
import useProfileCardContext from '@/hooks/useProfileCardContext';
import ProfileCardSkeleton from './ProfileCardSkeleton';
import ProfileCardDropdownMenu from '@/components/ProfileCard/ProfileCardDropdownMenu';

interface IProps {
  userId: UUID;
}

export default function ProfileCard({ userId }: IProps) {
  const { user: currentUser } = useAppSelector(selectAuth);
  const isMe = userId == currentUser?.id;
  const { data: user, isPending } = useGetUserInfomation(
    { userId },
    {
      enabled: !isMe,
    },
  );

  if (isPending && !isMe) return <ProfileCardSkeleton />;

  if (isMe || !user) return null;

  return (
    <ProfileCardProvider userData={user}>
      <ContentWrapper className='w-screen max-w-md space-y-4 border rounded-md shadow-lg border-border'>
        <div className='w-full space-y-4'>
          {/* Profile Header */}
          <ProfileHeader />

          <Separator />

          {/* Profile Content */}
          <ProfileContent />
        </div>

        <Separator />

        {/* Profile Action */}
        <ProfileActions />
      </ContentWrapper>
    </ProfileCardProvider>
  );
}

function ProfileHeader() {
  const { userData } = useProfileCardContext();
  return (
    <div className='w-full space-y-4'>
      {/* Profile Header */}
      <div className='flex items-center gap-4'>
        <ProfileLink username={userData.username}>
          <UserAvatar avatarUrl={userData.avatar} />
        </ProfileLink>

        <ProfileLink username={userData.username} className=''>
          {userData.fullName}
        </ProfileLink>
      </div>
    </div>
  );
}

function ProfileContent() {
  const { userData } = useProfileCardContext();

  return (
    <div className='space-y-3'>
      {/* User meta date */}
      <UserMetaData user={userData} />

      {/* additionalInfo */}
      <UserAdditionalInfo user={userData} />
    </div>
  );
}

function ProfileActions() {
  const { userData } = useProfileCardContext();

  return (
    <div className='flex justify-around w-full gap-x-2'>
      <FollowButton className='w-1/2' userId={userData.id} />

      <Button variant='secondary' className='flex-1'>
        <MessageCircle />
        Message
      </Button>
      <ProfileCardDropdownMenu user={userData} />
    </div>
  );
}
