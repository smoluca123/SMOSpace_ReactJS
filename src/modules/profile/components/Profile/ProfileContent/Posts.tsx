import { PostList } from '@/components/Posts';
import { useGetMyPosts, useGetPosts } from '@/components/Posts/querys';
import { useProfileContext } from '@/hooks/useProfileContext';

export default function Posts() {
  const { isMe, userData } = useProfileContext();

  const myPostsQuery = useGetMyPosts(
    {},
    {
      enabled: isMe,
    },
  );

  const userPostsQuery = useGetPosts(
    {
      userId: userData.id,
    },
    {
      enabled: !isMe,
    },
  );
  return <PostList infinitePostData={isMe ? myPostsQuery : userPostsQuery} />;
}
