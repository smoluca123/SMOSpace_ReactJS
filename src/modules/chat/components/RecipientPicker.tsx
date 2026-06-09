import { getShareRecipientsAPI } from '@/apis/chatApi';
import { IShareRecipientType } from '@/apis/types/chat.interfaces';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import UserAvatar from '@/components/UserAvatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { Loader2, Search } from 'lucide-react';
import { useState } from 'react';

/**
 * Multi-select list of people the user can share with: friends, followings and
 * existing chat partners (resolved + searchable server-side). Controlled via
 * `selectedUserIds` / `onToggle`.
 */
export default function RecipientPicker({
  selectedUserIds,
  onToggle,
}: {
  selectedUserIds: string[];
  onToggle: (user: IShareRecipientType) => void;
}) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['chat', 'share-recipients', debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      getShareRecipientsAPI({ search: debouncedSearch || undefined, page: pageParam }).then(
        (res) => res.data,
      ),
    getNextPageParam: ({ hasNextPage, currentPage }) => (hasNextPage ? currentPage + 1 : undefined),
    initialPageParam: 1,
  });

  const recipients = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className='space-y-2'>
      <div className='flex items-center px-3 gap-2 rounded-full bg-muted'>
        <Search className='w-4 h-4 text-muted-foreground' />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search people...'
          className='bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
        />
      </div>

      {isLoading ? (
        <div className='flex justify-center py-6'>
          <Loader2 className='w-5 h-5 animate-spin text-muted-foreground' />
        </div>
      ) : recipients.length === 0 ? (
        <p className='py-6 text-sm text-center text-muted-foreground'>
          {debouncedSearch ? 'No people found.' : 'No one to share with yet.'}
        </p>
      ) : (
        <div className='max-h-[300px] overflow-y-auto'>
          <InfiniteScrollContainer
            onBottomReached={fetchNextPage}
            isShowInViewElement={hasNextPage}
            className='space-y-1'
          >
            {recipients.map((person) => {
              const checked = selectedUserIds.includes(person.id);
              return (
                <label
                  key={person.id}
                  className='flex gap-3 items-center p-2 rounded-lg cursor-pointer hover:bg-muted/50'
                >
                  <Checkbox checked={checked} onCheckedChange={() => onToggle(person)} />
                  <UserAvatar
                    avatarUrl={person.avatar ?? undefined}
                    fallbackName={person.fullName}
                    className='w-9 h-9'
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>{person.fullName}</p>
                    <p className='text-xs truncate text-muted-foreground'>@{person.username}</p>
                  </div>
                </label>
              );
            })}
            {isFetchingNextPage && (
              <div className='flex justify-center py-2'>
                <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
              </div>
            )}
          </InfiniteScrollContainer>
        </div>
      )}
    </div>
  );
}
