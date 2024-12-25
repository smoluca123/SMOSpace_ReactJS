import { PostList } from '@/components/Posts';
import { useGetPosts } from '@/components/Posts/querys';
import SubmitPostBox from '@/modules/home/components/SubmitPostBox';
import GreetingAlert from '../components/GreetingAlert';

export default function HomePage() {
  const query = useGetPosts();
  return (
    <main className='flex-1 overflow-hidden'>
      <div className='flex-auto space-y-6'>
        <SubmitPostBox />

        <GreetingAlert />

        <PostList infinitePostData={query} />
      </div>
    </main>
  );
}
