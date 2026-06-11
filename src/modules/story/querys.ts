import { getStoryFeedAPI, getStoryViewersAPI } from '@/apis/storyApi';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const storyFeedQueryKey = ['story', 'feed'];

export function useGetStoryFeed() {
  return useInfiniteQuery({
    queryKey: storyFeedQueryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await getStoryFeedAPI({ page: pageParam });
      return data;
    },
    getPreviousPageParam: ({ hasPreviousPage, currentPage }) =>
      hasPreviousPage ? currentPage - 1 : undefined,
    getNextPageParam: ({ hasNextPage, currentPage }) => (hasNextPage ? currentPage + 1 : undefined),
    initialPageParam: 1,
    staleTime: 1000 * 60,
  });
}

export const storyViewersQueryKey = (storyId: string) => ['story', 'viewers', storyId];

export function useGetStoryViewers(storyId: string, enabled: boolean) {
  return useQuery({
    queryKey: storyViewersQueryKey(storyId),
    queryFn: async () => {
      const { data } = await getStoryViewersAPI({ storyId });
      return data;
    },
    enabled,
  });
}
