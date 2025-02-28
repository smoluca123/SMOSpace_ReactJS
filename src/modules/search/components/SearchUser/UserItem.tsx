import FollowButton from '@/components/FollowButton';
import ProfileLink from '@/components/ProfileLink';
import UserAvatar from '@/components/UserAvatar';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { Dot } from 'lucide-react';

export default function UserItem({ user }: { user: IUserDataWithFollowedStatusType }) {
  const { user: currentUser } = useAppSelector(selectAuth);

  const isMe = user.id === currentUser?.id;

  if (isMe) return null;

  return (
    <ContentWrapper className='~p-3/4  border border-border  flex gap-y-4 flex-col items-center justify-center rounded-md '>
      {/* Avatar */}
      <ProfileLink username={user.username}>
        <UserAvatar className='size-16' avatarUrl={user.avatar} fallbackName={user.fullName} />
      </ProfileLink>

      <h1 className='font-bold line-clamp-1'>{user.fullName}</h1>

      <div className='flex items-center justify-center text-sm text-center text-muted-foreground'>
        <p>{user.followerCount} Followers</p>
        <Dot />
        <p>{user.postCount} Posts</p>
      </div>

      {/* Follow action */}
      <FollowButton user={user} />
    </ContentWrapper>
  );
}
