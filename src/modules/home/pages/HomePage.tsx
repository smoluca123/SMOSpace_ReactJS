import SubmitPostBox from '@/modules/home/components/SubmitPostBox';
import GreetingAlert from '../components/GreetingAlert';
import HasNewPostButton from '@/components/HasNewPostButton';
import PostTabs from '@/modules/home/components/PostTabs';

export default function HomePage() {
  return (
    <main className='overflow-hidden flex-1'>
      <HasNewPostButton />
      <div className='flex-auto space-y-6'>
        <SubmitPostBox />

        <GreetingAlert />

        <PostTabs />
      </div>
    </main>
  );
}
