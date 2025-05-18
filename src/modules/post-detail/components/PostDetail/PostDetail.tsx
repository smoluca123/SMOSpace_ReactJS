import Post from '@/components/Posts/Post';
import { PostLoadingSkeleton } from '@/components/Posts/PostLoadingSkeleton';
import { PostProvider } from '@/components/Posts/PostProvider';
import { useGetPost } from '@/modules/post-detail/components/PostDetail/querys';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { UUID } from 'crypto';
import { Navigate } from 'react-router-dom';

export default function PostDetail({ postId }: { postId: UUID }) {
  const { user } = useAppSelector(selectAuth);
  const { data: post, isLoading, isFetching } = useGetPost({ postId, likeUserId: user?.id });

  if (!post && !isLoading && !isFetching) {
    return <Navigate to='/' replace />;
  }

  return (
    <div>
      {/* loading */}
      {(isLoading || isFetching) && <PostLoadingSkeleton />}

      {post && (
        <PostProvider post={post} isRedirectWhenDeleteInitial={true}>
          <Post isExpanded={true} />
        </PostProvider>
      )}
    </div>
  );
}
