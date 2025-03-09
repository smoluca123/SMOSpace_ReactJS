import { FollowersSkeletons } from '@/components/Followers/FollowersSkeletons';
import { ProfileLinkWithCard } from '@/components/ProfileLink';
import UserAvatar from '@/components/UserAvatar';
import { useGetUserFollowersQuery } from '@/lib/querys';
import { formatNumber } from '@/lib/utils';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { UUID } from 'crypto';

export default function Followers({ userId }: { userId: UUID }) {
  const { data, isLoading } = useGetUserFollowersQuery({ userId });
  const followersCount = Number(data?.pages.reduce((acc, page) => acc + page.items.length, 0));

  return (
    <ContentWrapper className='space-y-2'>
      <h1 className='text-lg font-semibold'>
        Followers {data && <span>{formatNumber(followersCount)}</span>}
      </h1>

      {/* Followers */}
      <div className='flex gap-2'>
        {data &&
          data.pages.flatMap((page) =>
            page.items.map(({ follower }) => (
              <ProfileLinkWithCard
                key={follower.id}
                userId={follower.id}
                username={follower.username}
              >
                <UserAvatar avatarUrl={follower.avatar} className='w-10 h-10 rounded-full' />
              </ProfileLinkWithCard>
            )),
          )}
      </div>

      {/* Loading */}
      {isLoading && <FollowersSkeletons length={5} />}
    </ContentWrapper>
  );
}
