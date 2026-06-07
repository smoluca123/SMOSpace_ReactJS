import {
  acceptMessageRequestAPI,
  getMessageRequestCountAPI,
  getMessageRequestsAPI,
  rejectMessageRequestAPI,
} from '@/apis/chatApi';
import { activeChatRoomsQueryKey } from '@/modules/chat/components/Conversation/querys';
import { unreadChatCountQueryKey } from '@/modules/chat/querys';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const messageRequestsQueryKey = ['chat', 'message-requests'];
export const messageRequestCountQueryKey = ['chat', 'message-requests', 'count'];

export function useGetMessageRequests() {
  return useInfiniteQuery({
    queryKey: messageRequestsQueryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await getMessageRequestsAPI({ page: pageParam, limit: 20 });
      return data;
    },
    getNextPageParam: ({ hasNextPage, currentPage }) => (hasNextPage ? currentPage + 1 : undefined),
    getPreviousPageParam: ({ hasPreviousPage, currentPage }) =>
      hasPreviousPage ? currentPage - 1 : undefined,
    initialPageParam: 1,
  });
}

export function useGetMessageRequestCount() {
  return useQuery({
    queryKey: messageRequestCountQueryKey,
    queryFn: async () => {
      const { data } = await getMessageRequestCountAPI();
      return data.count;
    },
    staleTime: 1000 * 30,
  });
}

export function useAcceptMessageRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId }: { roomId: string }) => acceptMessageRequestAPI({ roomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageRequestsQueryKey });
      queryClient.invalidateQueries({ queryKey: messageRequestCountQueryKey });
      queryClient.invalidateQueries({ queryKey: activeChatRoomsQueryKey });
      queryClient.invalidateQueries({ queryKey: unreadChatCountQueryKey });
    },
  });
}

export function useRejectMessageRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId }: { roomId: string }) => rejectMessageRequestAPI({ roomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageRequestsQueryKey });
      queryClient.invalidateQueries({ queryKey: messageRequestCountQueryKey });
    },
  });
}
