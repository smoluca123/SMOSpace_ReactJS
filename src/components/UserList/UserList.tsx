import { FollowersSkeletons } from '@/components/Followers/FollowersSkeletons';
import { ProfileLinkWithCard } from '@/components/ProfileLink';
import UserAvatar from '@/components/UserAvatar';
import { IApiPaginationResponseWrapper, IUserDataType } from '@/lib/types/interfaces';
import { formatNumber } from '@/lib/utils';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';

interface IProps {
  queryData: UseInfiniteQueryResult<
    InfiniteData<IApiPaginationResponseWrapper<IUserDataType>['data']>
  >;
}

export default function UserList({ queryData }: IProps) {
  const { data, isLoading } = queryData;
  const friendsCount = Number(data?.pages.reduce((acc, page) => acc + page.items.length, 0));

  return (
    <ContentWrapper className='space-y-2'>
      <h1 className='text-lg font-semibold'>
        Friends {queryData && <span>{formatNumber(friendsCount)}</span>}
      </h1>

      {/* Friends */}
      <div className='flex gap-2'>
        {data &&
          data.pages.flatMap((page) =>
            page.items.map(({ id, username, avatar }) => (
              <ProfileLinkWithCard key={id} userId={id} username={username}>
                <UserAvatar userId={id} avatarUrl={avatar} className='w-10 h-10 rounded-full' />
              </ProfileLinkWithCard>
            )),
          )}
      </div>

      {/* Loading */}
      {isLoading && <FollowersSkeletons length={5} />}
    </ContentWrapper>
  );
}
