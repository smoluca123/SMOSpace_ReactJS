import { PostList } from '@/components/Posts';
import { useGetMyPosts, useGetPosts } from '@/components/Posts/querys';
import { useProfileContext } from '@/hooks/useProfileContext';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

export default function Posts() {
  const { isMe, userData } = useProfileContext();
  const { user: currentUser } = useAppSelector(selectAuth);

  const myPostsQuery = useGetMyPosts(
    {},
    {
      enabled: isMe,
    },
  );

  const userPostsQuery = useGetPosts(
    {
      userId: userData.id,
      // Viewer id so like-status and block-filtering resolve correctly
      likeUserId: currentUser?.id,
    },
    {
      enabled: !isMe,
    },
  );
  return <PostList infinitePostData={isMe ? myPostsQuery : userPostsQuery} />;
}
