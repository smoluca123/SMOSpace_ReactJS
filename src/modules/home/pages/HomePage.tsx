import { PostList } from '@/components/Posts';
import { useGetPosts } from '@/components/Posts/querys';
import SubmitPostBox from '@/modules/home/components/SubmitPostBox';
import GreetingAlert from '../components/GreetingAlert';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { FirstPost } from '@/components/Posts/PostList';

export default function HomePage() {
  const { user } = useAppSelector(selectAuth);
  const query = useGetPosts({ likeUserId: user?.id });
  return (
    <main className='overflow-hidden flex-1'>
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
