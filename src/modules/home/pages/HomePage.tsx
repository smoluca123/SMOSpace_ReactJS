import { PostList } from '@/components/Posts';
import { useGetPosts } from '@/components/Posts/querys';
import SubmitPostBox from '@/modules/home/components/SubmitPostBox';

export default function HomePage() {
  const query = useGetPosts();
  return (
    <main className='overflow-hidden flex-1'>
      <div className='flex-auto space-y-6'>
        <SubmitPostBox />

        <PostList infinitePostData={query} />
      </div>
    </main>
  );
}
