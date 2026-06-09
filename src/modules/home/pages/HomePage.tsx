import SubmitPostBox from '@/modules/home/components/SubmitPostBox';
import GreetingAlert from '../components/GreetingAlert';
import HasNewPostButton from '@/components/HasNewPostButton';
import PostTabs from '@/modules/home/components/PostTabs';
import StoryBar from '@/modules/story/components/StoryBar';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

export default function HomePage() {
  const { user } = useAppSelector(selectAuth);
  return (
    <main className='overflow-hidden flex-1'>
      <HasNewPostButton />
      <div className='flex-auto space-y-6'>
        <SubmitPostBox />

        {user && <StoryBar />}

        <GreetingAlert />

        <PostTabs />
      </div>
    </main>
  );
}
