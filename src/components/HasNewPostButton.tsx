import { Button } from '@/components/ui/button';
import {
  IApiPaginationResponseWrapper,
  IPostDataWithLikedStatusType,
} from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { resetHasNewPost, resetNewPosts, selectPost } from '@/redux/slices/postSlice';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, X } from 'lucide-react';

export default function HasNewPostButton() {
  const { newPosts, hasNewPost } = useAppSelector(selectPost);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const handleResetHasNewPost = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(resetHasNewPost());
  };

  const handleRefresh = () => {
    dispatch(resetHasNewPost());
    dispatch(resetNewPosts());
    queryClient.cancelQueries({ queryKey: ['posts'] });

    queryClient.setQueriesData(
      {
        queryKey: ['posts'],
      },
      (
        oldData: InfiniteData<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data']>,
      ) => {
        if (!oldData) return oldData;

        const firstPage = oldData.pages[0];
        const updatedFirstPage = {
          ...firstPage,
          items: [...newPosts, ...firstPage.items],
        };

        return {
          ...oldData,
          pages: [updatedFirstPage, ...oldData.pages.slice(1)],
        };
      },
    );
  };

  return (
    <div
      className={cn(
        'absolute top-20 left-1/2 z-50 opacity-0 transition-all duration-300 -translate-x-1/2',
        {
          'opacity-100 !visible': hasNewPost,
          '!invisible pointer-events-none': !hasNewPost,
        },
      )}
    >
      <Button className='relative text-white rounded-full' onClick={handleRefresh}>
        <RefreshCw className='w-4 h-4' />
        Refresh
        <span
          className='absolute -top-2 -right-2 z-50 p-1 text-white rounded-full cursor-pointer bg-destructive/70'
          onClick={handleResetHasNewPost}
        >
          <X className='w-2 h-2' />
        </span>
      </Button>
    </div>
  );
}
