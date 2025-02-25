import UserCard from '@/components/UserCard';
import NewUsers from './NewUsers';
import { TrendingTopics } from './TrendingTopics';

export default function Sidebar() {
  return (
    <div className='~min-w-[10rem]/[20rem] max-w-[20rem] hidden lg:block space-y-6 max-h-dvh sticky top-0 overflow-y-auto scrollbar-hide'>
      <UserCard />
      <TrendingTopics />
      <NewUsers />
    </div>
  );
}
