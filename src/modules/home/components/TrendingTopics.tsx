// Import necessary dependencies
import { Hash } from 'lucide-react';
import { useGetTrendingTopics } from './querys';
import LinkifyHashTag from '@/components/LinkifyHashTag';
import ContentWrapper from './ContentWrapper';
import { formatNumber } from '@/lib/utils';
import { TrendingTopicsSkeleton } from './TrendingTopicsSkeleton';

// Component to display trending hashtags with post counts
export function TrendingTopics() {
  // Fetch trending topics data using custom hook
  const { data, isFetching } = useGetTrendingTopics();

  return (
    <ContentWrapper className=' space-y-4'>
      {/* Section title */}
      <h1 className=' text-lg font-semibold'>Trendings ⚡️</h1>

      {/* Display trending topics list when data is loaded */}
      {!isFetching &&
        data?.data.map(({ hashtag, count }) => (
          <div className=' transition-colors p-2 hover:bg-accent duration-300 flex gap-x-4 rounded-md  items-center'>
            {/* Hash icon for visual indication */}
            <Hash />
            <div>
              {/* Hashtag text with link functionality */}
              <LinkifyHashTag>{hashtag}</LinkifyHashTag>
              {/* Number of posts using this hashtag */}
              <p className=' text-muted-foreground'>{`${formatNumber(count)} ${count < 2 ? 'Post' : 'Posts'}`}</p>
            </div>
          </div>
        ))}
      {/* Loading skeleton with default 3 items */}
      {isFetching && <TrendingTopicsSkeleton />}
    </ContentWrapper>
  );
}
