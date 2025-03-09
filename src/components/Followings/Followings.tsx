import { FollowersSkeletons } from '@/components/Followers/FollowersSkeletons';
import { ProfileLinkWithCard } from '@/components/ProfileLink';
import UserAvatar from '@/components/UserAvatar';
import { useGetUserFollowingsQuery } from '@/lib/querys';
import { formatNumber } from '@/lib/utils';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { UUID } from 'crypto';

export default function Followings({ userId }: { userId: UUID }) {
  const { data, isLoading } = useGetUserFollowingsQuery({ userId });
  const followersCount = Number(data?.pages.reduce((acc, page) => acc + page.items.length, 0));

  return (
    <ContentWrapper className='space-y-2'>
      <h1 className='text-lg font-semibold'>
        Followings {data && <span>{formatNumber(followersCount)}</span>}
      </h1>

      {/* Followers */}
      <div className='flex gap-2'>
        {data &&
          data.pages.flatMap((page) =>
            page.items.map(({ following }) => (
              <ProfileLinkWithCard
                key={following.id}
                userId={following.id}
                username={following.username}
              >
                <UserAvatar avatarUrl={following.avatar} className='w-10 h-10 rounded-full' />
              </ProfileLinkWithCard>
            )),
          )}
      </div>

      {/* Loading */}
      {isLoading && <FollowersSkeletons length={5} />}
    </ContentWrapper>
  );
}
