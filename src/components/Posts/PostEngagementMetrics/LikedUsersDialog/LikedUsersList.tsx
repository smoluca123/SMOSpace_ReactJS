import FollowButton from '@/components/FollowButton';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import LikedUsersSkeletons from '@/components/Posts/PostEngagementMetrics/LikedUsersDialog/LikedUsersSkeletons';
import { useGetLikedUsers } from '@/components/Posts/PostEngagementMetrics/LikedUsersDialog/querys';
import ProfileLink from '@/components/ProfileLink';
import UserAvatar from '@/components/UserAvatar';
import { usePostContext } from '@/hooks/usePostContext';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

export default function LikedUsersList({ enableFetch }: { enableFetch?: boolean }) {
  const { user } = useAppSelector(selectAuth);
  const { post } = usePostContext();
  const {
    data: likedUsers,
    isLoading: isLikedUsersLoading,
    fetchNextPage,
    hasNextPage,
  } = useGetLikedUsers({
    postId: post.id,
    enabled: enableFetch ?? false,
  });
  return (
    <InfiniteScrollContainer
      onBottomReached={() => fetchNextPage()}
      isShowInViewElement={hasNextPage}
    >
      <div className='space-y-4'>
        {/* Skeleton */}
        {isLikedUsersLoading && <LikedUsersSkeletons count={5} />}

        {/* Liked Users */}
        {likedUsers &&
          likedUsers.pages.flatMap((page) =>
            page.items.map((like) => (
              <div className='flex items-center justify-between'>
                {/* User Infomation */}
                <div className='flex items-center gap-2'>
                  <ProfileLink username={like.user.username}>
                    <UserAvatar
                      key={like.user.id}
                      avatarUrl={like.user.avatar}
                      fallbackName={like.user.fullName}
                    />
                  </ProfileLink>
                  <ProfileLink username={like.user.username}>{like.user.fullName}</ProfileLink>
                </div>
                <div className=''>
                  {/* <Button className='text-foreground'>Add</Button> */}
                  {like.user.id !== user?.id && <FollowButton userId={like.user.id} />}
                </div>
              </div>
            )),
          )}
      </div>
    </InfiniteScrollContainer>
  );
}
