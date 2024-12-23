import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { useGetTrendingTopics } from './querys';
import LinkifyHashTag from '@/components/LinkifyHashTag';
import { Hash } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function Sidebar() {
  return (
    <div className='~min-w-[10rem]/[20rem] max-w-[20rem] hidden lg:block space-y-6 max-h-dvh sticky top-0'>
      <TrendingHastag />
    </div>
  );
}

function TrendingHastag() {
  const { data } = useGetTrendingTopics();

  return (
    <ContentWrapper className=' space-y-4'>
      <h1 className=' text-lg font-semibold'>Trendings ⚡️</h1>
      {data?.data.map(({ hashtag, count }) => (
        <div className=' transition-colors hover:bg-accent duration-300 flex gap-x-4 rounded-md  items-center'>
          <Hash />
          <div>
            <LinkifyHashTag>{hashtag}</LinkifyHashTag>
            <p className=' text-muted-foreground'>{`${formatNumber(count)} ${count < 2 ? 'Post' : 'Posts'}`}</p>
          </div>
        </div>
      ))}
    </ContentWrapper>
  );
}
