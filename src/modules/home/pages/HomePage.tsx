import { PostList } from '@/components/Posts';
import SubmitPostBox from '@/modules/home/components/SubmitPostBox';

export default function HomePage() {
  return (
    <main className="overflow-hidden flex-1">
      <div className="flex-auto space-y-6">
        <SubmitPostBox />

        <PostList />
      </div>
    </main>
  );
}
