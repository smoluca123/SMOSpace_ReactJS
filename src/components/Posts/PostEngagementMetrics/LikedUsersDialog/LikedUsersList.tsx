import FollowButton from '@/components/FollowButton';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import LikedUsersSkeletons from '@/components/Posts/PostEngagementMetrics/LikedUsersDialog/LikedUsersSkeletons';
import { useGetLikedUsers } from '@/components/Posts/PostEngagementMetrics/LikedUsersDialog/querys';
import ProfileLink from '@/components/ProfileLink';
import UserAvatar from '@/components/UserAvatar';
import { usePostContext } from '@/hooks/usePostContext';
import { getReactionConfig, IReactionType } from '@/lib/reactions';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

export default function LikedUsersList({
  enableFetch,
  type,
}: {
  enableFetch?: boolean;
  type?: IReactionType;
}) {
  const { user } = useAppSelector(selectAuth);
  const { post } = usePostContext();
  const {
    data: likedUsers,
    isLoading: isLikedUsersLoading,
    fetchNextPage,
    hasNextPage,
  } = useGetLikedUsers({
    postId: post.id,
    type,
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
            page.items.map((like) => {
              const reaction = getReactionConfig(like.type);
              return (
                <div key={like.id} className='flex items-center justify-between'>
                  {/* User Infomation */}
                  <div className='flex items-center gap-2'>
                    <ProfileLink username={like.user.username}>
                      <div className='relative'>
                        <UserAvatar
                          avatarUrl={like.user.avatar}
                          fallbackName={like.user.fullName}
                        />
                        {like.type && (
                          <span
                            className='absolute -right-1 -bottom-1 inline-flex justify-center items-center w-5 h-5 text-sm rounded-full ring-2 ring-background bg-background'
                            title={reaction.label}
                          >
                            {reaction.emoji}
                          </span>
                        )}
                      </div>
                    </ProfileLink>
                    <ProfileLink username={like.user.username}>{like.user.fullName}</ProfileLink>
                  </div>
                  <div>{like.user.id !== user?.id && <FollowButton userId={like.user.id} />}</div>
                </div>
              );
            }),
          )}
      </div>
    </InfiniteScrollContainer>
  );
}
