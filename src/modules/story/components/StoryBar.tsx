import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import UserAvatar from '@/components/UserAvatar';
import { cn } from '@/lib/utils';
import CreateStoryButton from '@/modules/story/components/CreateStoryButton';
import StoryViewer from '@/modules/story/components/StoryViewer';
import { storyFeedQueryKey, useGetStoryFeed } from '@/modules/story/querys';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function StoryBar() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetStoryFeed();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Flatten paginated author-groups into a single ordered list.
  const groups = data?.pages.flatMap((page) => page.items) ?? [];

  const handleCloseViewer = () => {
    setOpenIndex(null);
    // Refresh so viewed rings update (and deleted/expired stories drop off).
    queryClient.invalidateQueries({ queryKey: storyFeedQueryKey });
  };

  return (
    <div className='p-3 rounded-xl border bg-card'>
      <InfiniteScrollContainer
        className='flex gap-3 items-start overflow-x-auto scrollbar-hide'
        onBottomReached={fetchNextPage}
        isShowInViewElement={hasNextPage}
      >
        <CreateStoryButton />

        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='flex flex-col gap-1 items-center w-[72px] shrink-0'>
              <div className='w-[70px] h-[70px] rounded-full animate-pulse bg-muted' />
              <div className='w-12 h-3 rounded animate-pulse bg-muted' />
            </div>
          ))}

        {groups.map((group, index) => (
          <button
            key={group.author.id}
            type='button'
            onClick={() => setOpenIndex(index)}
            className='flex flex-col gap-1 items-center w-[72px] shrink-0 focus:outline-none'
          >
            <div
              className={cn(
                'grid place-items-center w-[70px] h-[70px] rounded-full shrink-0',
                group.hasUnviewed
                  ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'
                  : 'bg-muted',
              )}
            >
              <UserAvatar
                avatarUrl={group.author.avatar}
                fallbackName={group.author.fullName}
                className='w-16 h-16 rounded-full ring-2 ring-card'
                showStatus={false}
              />
            </div>
            <span className='w-full text-xs text-center truncate text-foreground'>
              {group.author.fullName}
            </span>
          </button>
        ))}

        {isFetchingNextPage && (
          <div className='flex justify-center items-center w-10 h-[70px] shrink-0'>
            <Loader2 className='w-5 h-5 animate-spin text-muted-foreground' />
          </div>
        )}
      </InfiniteScrollContainer>

      {openIndex !== null && groups.length > 0 && (
        <StoryViewer groups={groups} initialGroupIndex={openIndex} onClose={handleCloseViewer} />
      )}
    </div>
  );
}
