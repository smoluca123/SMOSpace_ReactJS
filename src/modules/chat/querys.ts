import { getUnreadChatCountAPI } from '@/apis/chatApi';
import { useQuery } from '@tanstack/react-query';

export const unreadChatCountQueryKey = ['chat', 'unread-count'];

export function useGetUnreadChatCount() {
  return useQuery({
    queryKey: unreadChatCountQueryKey,
    queryFn: async () => {
      const { data } = await getUnreadChatCountAPI();
      return data.count;
    },
    staleTime: 1000 * 30,
  });
}
