import { PostList } from '@/components/Posts';
import { useGetPosts } from '@/components/Posts/querys';
import SubmitPostBox from '@/modules/home/components/SubmitPostBox';
import GreetingAlert from '../components/GreetingAlert';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { PostProvider } from '@/components/Posts/PostProvider';
import Post from '@/components/Posts/Post';
import { PostLoadingSkeleton } from '@/components/Posts/PostLoadingSkeleton';

export default function HomePage() {
  const { user } = useAppSelector(selectAuth);
  const query = useGetPosts({ likeUserId: user?.id });
  return (
    <main className='flex-1 overflow-hidden'>
      <div className='flex-auto space-y-6'>
        <SubmitPostBox />

        <GreetingAlert />

        {/* First Post */}
        <FirstPost />

        <PostList infinitePostData={query} skipFirstPost={true} />
      </div>
    </main>
  );
}

function FirstPost() {
  const { user } = useAppSelector(selectAuth);
  const { data, isLoading } = useGetPosts({ likeUserId: user?.id });
  return (
    <>
      {/* First Post */}
      {isLoading && <PostLoadingSkeleton />}
      {data && (
        <PostProvider post={data.pages[0].items[0]}>
          <Post />
        </PostProvider>
      )}
    </>
  );
}
