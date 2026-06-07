import { getRoomMessagesAPI } from '@/apis/chatApi';
import { IPaginationParamsType } from '@/lib/types/interfaces';
import { useInfiniteQuery } from '@tanstack/react-query';

export const getRoomsMessagesQueryKey = ({ roomId }: { roomId: string }) => [
  'rooms',
  'messages',
  roomId,
];

export const useGetRoomsMessagesQuery = ({ roomId }: { roomId: string }) => {
  const getRoomMessages = async (params: IPaginationParamsType) => {
    try {
      const { data } = await getRoomMessagesAPI({ roomId, limit: params.limit, page: params.page });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  return useInfiniteQuery({
    queryKey: getRoomsMessagesQueryKey({ roomId }),
    queryFn: ({ pageParam = 1 }) => getRoomMessages({ page: pageParam }),
    getNextPageParam: ({ hasNextPage, currentPage }) => (hasNextPage ? currentPage + 1 : undefined),
    getPreviousPageParam: ({ hasPreviousPage, currentPage }) =>
      hasPreviousPage ? currentPage - 1 : undefined,
    initialPageParam: 1,
    // Don't retry: a 4xx (e.g. not a participant) won't fix itself, and we
    // want the UI to surface the error promptly instead of looping.
    retry: false,
  });
};
