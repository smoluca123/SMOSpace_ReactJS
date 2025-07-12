import { getActiveChatRoomsAPI } from '@/apis/chatApi';
import { useInfiniteQuery } from '@tanstack/react-query';

export const activeChatRoomsQueryKey = ['chat', 'active-rooms'];

export const useGetActiveChatRoomsQuery = () => {
  const getActiveChatRooms = async () => {
    try {
      const { data } = await getActiveChatRoomsAPI();
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  return useInfiniteQuery({
    queryKey: activeChatRoomsQueryKey,
    queryFn: getActiveChatRooms,
    getPreviousPageParam: ({ hasPreviousPage, currentPage }) =>
      hasPreviousPage ? currentPage - 1 : undefined,
    getNextPageParam: ({ hasNextPage, currentPage }) => (hasNextPage ? currentPage + 1 : undefined),
    initialPageParam: 1,
  });
};
