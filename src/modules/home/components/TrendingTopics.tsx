// Import necessary dependencies
import { Hash } from 'lucide-react';
import { useGetTrendingTopics } from './querys';
import LinkifyHashTag from '@/components/LinkifyHashTag';
import ContentWrapper from './ContentWrapper';
import { formatNumber } from '@/lib/utils';

// Component to display trending hashtags with post counts
export function TrendingTopics() {
  // Fetch trending topics data using custom hook
  const { data } = useGetTrendingTopics();

  return (
    <ContentWrapper className=' space-y-4'>
      {/* Section title */}
      <h1 className=' text-lg font-semibold'>Trendings ⚡️</h1>

      {/* Map through trending topics and display each one */}
      {data?.data.map(({ hashtag, count }) => (
        <div className=' transition-colors hover:bg-accent duration-300 flex gap-x-4 rounded-md  items-center'>
          {/* Hashtag icon */}
          <Hash />
          <div>
            {/* Clickable hashtag link */}
            <LinkifyHashTag>{hashtag}</LinkifyHashTag>
            {/* Post count with proper pluralization */}
            <p className=' text-muted-foreground'>{`${formatNumber(count)} ${count < 2 ? 'Post' : 'Posts'}`}</p>
          </div>
        </div>
      ))}
    </ContentWrapper>
  );
}
