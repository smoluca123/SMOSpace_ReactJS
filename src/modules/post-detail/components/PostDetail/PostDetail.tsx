import Post from '@/components/Posts/Post';
import { PostLoadingSkeleton } from '@/components/Posts/PostLoadingSkeleton';
import { PostProvider } from '@/components/Posts/PostProvider';
import { useGetPost } from '@/modules/post-detail/components/PostDetail/querys';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { UUID } from 'crypto';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PostDetail({ postId }: { postId: UUID }) {
  const { user } = useAppSelector(selectAuth);
  const { data: post, isLoading, isFetching, error } = useGetPost({ postId, likeUserId: user?.id });

  // Loading state
  if (isLoading || isFetching) {
    return <PostLoadingSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className='flex min-h-[400px] items-center justify-center p-8'>
        <div className='max-w-md space-y-4 text-center'>
          <div className='flex justify-center'>
            <AlertCircle className='w-16 h-16 text-muted-foreground' />
          </div>

          <div className='space-y-2'>
            <h2 className='text-2xl font-semibold'>{error as unknown as string}</h2>
            <p className='text-muted-foreground'>{error as unknown as string}</p>
          </div>

          <Link
            to='/'
            className='inline-block px-6 py-2 mt-4 transition-colors rounded-md bg-primary text-foreground hover:bg-primary/90'
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // No post data
  if (!post) {
    return (
      <div className='flex min-h-[400px] items-center justify-center p-8'>
        <div className='max-w-md space-y-4 text-center'>
          <AlertCircle className='w-16 h-16 mx-auto text-muted-foreground' />
          <div className='space-y-2'>
            <h2 className='text-2xl font-semibold'>Post Not Found</h2>
            <p className='text-muted-foreground'>
              The post you are looking for does not exist or has been deleted.
            </p>
          </div>
          <Link
            to='/'
            className='inline-block px-6 py-2 mt-4 transition-colors rounded-md bg-primary text-primary-foreground hover:bg-primary/90'
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div>
      <PostProvider post={post} isRedirectWhenDeleteInitial={true}>
        <Post isExpanded={true} />
      </PostProvider>
    </div>
  );
}
