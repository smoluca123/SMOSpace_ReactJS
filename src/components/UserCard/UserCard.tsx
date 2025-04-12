import NameWithBadge from '@/components/NameWithBadge';
import NameWithVerifiedIcon from '@/components/NameWithVerifiedIcon';
import ProfileLink from '@/components/ProfileLink';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/UserAvatar';
import UserCardSkeleton from '@/components/UserCard/UserCardSkeleton';
import { useGetMyFollowersQuery, useGetMyInfomation } from '@/lib/querys';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { Dot } from 'lucide-react';

export default function UserCard() {
  const { isAuthenticated } = useAppSelector(selectAuth);

  const { data: user, isLoading: isLoadingUser } = useGetMyInfomation({
    enabled: isAuthenticated,
  });

  const { data: followers, isLoading: isLoadingFollowers } = useGetMyFollowersQuery({
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;
  return (
    <>
      {isLoadingUser && <UserCardSkeleton />}
      {!isLoadingUser && user && (
        <ContentWrapper className='space-y-4 text-center'>
          <ProfileLink username={user.username} className='mx-auto w-fit'>
            <UserAvatar
              fallbackName={user.fullName}
              avatarUrl={user.avatar}
              className='mx-auto size-32'
            />
          </ProfileLink>
          <div className=''>
            <ProfileLink username={user.username} className='mx-auto w-fit'>
              <NameWithBadge userData={user}>
                <NameWithVerifiedIcon isVerified={user.isVerified}>
                  <p className='text-xl font-semibold'>{user.fullName}</p>
                </NameWithVerifiedIcon>
              </NameWithBadge>
            </ProfileLink>
            <ProfileLink username={user.username} className='font-normal !no-underline'>
              <p className='text-muted-foreground'>@{user.username}</p>
            </ProfileLink>
          </div>
          <div className='flex gap-x-1 justify-center items-center text-sm text-muted-foreground'>
            <p>{user.followerCount} Followers</p>
            <Dot />
            <p>{user.postCount} Posts</p>
            <Dot />
            <p>{user.followingCount} Following</p>
          </div>
          <div className='flex gap-2 justify-center items-center'>
            {isLoadingFollowers &&
              Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className='size-8' />
              ))}

            {followers &&
              followers.pages[0].items.slice(0, 5).map((follow) => (
                <ProfileLink key={follow.id} username={follow.follower.username}>
                  <UserAvatar
                    fallbackName={follow.follower.fullName}
                    avatarUrl={follow.follower.avatar}
                    className='size-8'
                  />
                </ProfileLink>
              ))}
          </div>
        </ContentWrapper>
      )}
    </>
  );
}
