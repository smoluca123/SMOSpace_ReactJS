import Post from '@/components/Posts/Post';
import { PostProvider } from '@/components/Posts/PostProvider';
import { useGetPost } from '@/modules/post-detail/components/PostDetail/querys';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { UUID } from 'crypto';

export default function PostDetail({ postId }: { postId: UUID }) {
  const { user } = useAppSelector(selectAuth);
  const { data: post } = useGetPost({ postId, likeUserId: user?.id });

  return (
    <div>
      {post && (
        <PostProvider post={post}>
          <Post isExpanded={true} />
        </PostProvider>
      )}
    </div>
  );
}
