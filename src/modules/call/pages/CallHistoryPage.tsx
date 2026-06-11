import { getCallHistoryAPI, type CallHistoryFilter } from '@/apis/callApi';
import type { ICallHistoryItem } from '@/apis/types/call.interfaces';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useInfiniteQuery } from '@tanstack/react-query';
import { History, Loader2, MicOff, Phone, PhoneMissed, Video } from 'lucide-react';
import { useState } from 'react';
import CallHistoryItem from '../components/CallHistoryItem';
import { cn } from '@/lib/utils';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';

// ---------------------------------------------------------------------------
// Filter tab config
// ---------------------------------------------------------------------------

type FilterTab = { value: CallHistoryFilter; label: string; icon: React.ReactNode };

const FILTER_TABS: FilterTab[] = [
  { value: 'all', label: 'All', icon: <Phone className='w-4 h-4' /> },
  { value: 'missed', label: 'Missed', icon: <PhoneMissed className='w-4 h-4' /> },
  { value: 'audio', label: 'Audio', icon: <MicOff className='w-4 h-4' /> },
  { value: 'video', label: 'Video', icon: <Video className='w-4 h-4' /> },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

/**
 * Call History page — lists all past calls the current user participated in.
 * Calls are sourced from SYSTEM chat messages written by the server when a call ends.
 * Supports four filter tabs: All / Missed / Audio / Video.
 */
export default function CallHistoryPage() {
  const { user } = useAppSelector(selectAuth);
  const [filter, setFilter] = useState<CallHistoryFilter>('all');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ['call-history', filter],
      queryFn: ({ pageParam = 1 }) =>
        getCallHistoryAPI({ page: pageParam as number, limit: 20, filter }),
      getNextPageParam: (lastPage) => {
        const { currentPage, pageSize, totalCount } = lastPage.data;
        return currentPage * pageSize < totalCount ? currentPage + 1 : undefined;
      },
      initialPageParam: 1,
      staleTime: 1000 * 60, // 1 minute
    });

  if (!user) return null;

  const allItems: ICallHistoryItem[] = data?.pages.flatMap((p) => p.data.items) ?? [];

  return (
    <section className='w-full space-y-5'>
      {/* Page header */}
      <ContentWrapper className='flex gap-3 items-center'>
        <History className='w-5 h-5 text-muted-foreground' />
        <h1 className='font-bold'>Call History</h1>
      </ContentWrapper>

      {/* Filter tabs */}
      <ContentWrapper className='pb-0'>
        <div
          id='call-history-filter-tabs'
          className='flex gap-1 p-1 w-fit rounded-xl bg-muted'
          role='tablist'
          aria-label='Filter calls'
        >
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              id={`call-history-filter-${tab.value}`}
              role='tab'
              aria-selected={filter === tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                'flex gap-1.5 items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-all',
                filter === tab.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </ContentWrapper>

      {/* Call list */}
      <ContentWrapper className='min-h-[200px]'>
        {isLoading && (
          <div className='flex justify-center items-center py-12'>
            <Loader2 className='w-6 h-6 animate-spin text-muted-foreground' />
          </div>
        )}

        {!isLoading && isError && (
          <p className='py-8 text-sm text-center text-muted-foreground'>
            Failed to load call history. Please try again.
          </p>
        )}

        {!isLoading && !isError && allItems.length === 0 && (
          <div className='flex flex-col gap-3 justify-center items-center py-16 text-muted-foreground'>
            <PhoneMissed className='w-12 h-12 opacity-30' />
            <p className='text-sm'>No calls found</p>
          </div>
        )}

        {allItems.length > 0 && (
          <InfiniteScrollContainer
            onBottomReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
            className='space-y-2'
          >
            {allItems.map((item) => (
              <CallHistoryItem key={item.messageId} item={item} currentUserId={user.id} />
            ))}

            {isFetchingNextPage && (
              <div className='flex justify-center py-4'>
                <Loader2 className='w-5 h-5 animate-spin text-muted-foreground' />
              </div>
            )}
          </InfiniteScrollContainer>
        )}
      </ContentWrapper>
    </section>
  );
}
