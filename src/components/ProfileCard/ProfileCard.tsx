'use client';
import UserAvatar from '../UserAvatar';
import { MessageCircle, Repeat2, Rss, UserRoundPlus } from 'lucide-react';
import ProfileCardDropdownMenu from './ProfileCardDropdownMenu';
import { UUID } from 'crypto';
import { Button } from '../ui/button';
import ProfileLink from '../ProfileLink';
import { Separator } from '../ui/separator';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import FollowButton from '../FollowButton';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useGetUserInfomation } from '@/lib/querys';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import UserMetaItem from '../UserMetaItem';

interface IProps {
  userId: UUID;
}

export default function ProfileCard({ userId }: IProps) {
  const { user: currentUser } = useAppSelector(selectAuth);
  const isMe = userId == currentUser?.id;
  const { data: user } = useGetUserInfomation(
    { userId, followerId: currentUser?.id },
    {
      enabled: !isMe,
    },
  );

  if (isMe) return null;

  return (
    <>
      {user && (
        <ContentWrapper className='w-full max-w-md space-y-4 border rounded-md shadow-lg border-border'>
          <div className='w-full space-y-4'>
            {/* Profile Header */}
            <ProfileHeader user={user} />

            <Separator />

            {/* Profile Content */}
            <ProfileContent user={user} />
          </div>

          <Separator />

          {/* Profile Action */}
          <ProfileActions user={user} />
        </ContentWrapper>
      )}
    </>
  );
}

function ProfileHeader({ user }: { user: IUserDataWithFollowedStatusType }) {
  return (
    <div className='w-full space-y-4'>
      {/* Profile Header */}
      <div className='flex items-center gap-4'>
        <ProfileLink username={user.username}>
          <UserAvatar avatarUrl={user.avatar} />
        </ProfileLink>

        <ProfileLink username={user.username} className=''>
          {user.fullName}
        </ProfileLink>
      </div>
    </div>
  );
}

function ProfileContent({ user }: { user: IUserDataWithFollowedStatusType }) {
  return (
    <div className='space-y-3'>
      <UserMetaItem icon={<Rss size={20} />}>{user.followerCount} followers</UserMetaItem>
      <UserMetaItem icon={<UserRoundPlus size={20} />}>
        Following {user.followingCount} people
      </UserMetaItem>
      <UserMetaItem icon={<Repeat2 size={20} />}>{user.postCount} posts</UserMetaItem>
    </div>
  );
}

function ProfileActions({ user }: { user: IUserDataWithFollowedStatusType }) {
  return (
    <div className='flex justify-around w-full gap-x-2'>
      <FollowButton user={user} />
      <Button variant='secondary' className='flex-1'>
        <MessageCircle />
        Message
      </Button>

      <ProfileCardDropdownMenu user={user} />
    </div>
  );
}
