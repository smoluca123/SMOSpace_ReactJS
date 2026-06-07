import {
  deleteConversationAPI,
  markRoomAsReadAPI,
  markRoomAsUnreadAPI,
  toggleMuteRoomAPI,
} from '@/apis/chatApi';
import { IChatRoomsDataType } from '@/apis/types/chat.interfaces';
import { IApiPaginationResponseWrapper } from '@/lib/types/interfaces';
import { activeChatRoomsQueryKey } from '@/modules/chat/components/Conversation/querys';
import { unreadChatCountQueryKey } from '@/modules/chat/querys';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

type RoomsCache = InfiniteData<IApiPaginationResponseWrapper<IChatRoomsDataType>['data']>;

function patchRoom(
  queryClient: ReturnType<typeof useQueryClient>,
  roomId: string,
  updater: (room: IChatRoomsDataType) => IChatRoomsDataType,
) {
  queryClient.setQueriesData<RoomsCache>({ queryKey: activeChatRoomsQueryKey }, (oldData) => {
    if (!oldData) return oldData;
    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        items: page.items.map((room) => (room.id === roomId ? updater(room) : room)),
      })),
    };
  });
}

export function useMarkConversationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId }: { roomId: string }) => markRoomAsReadAPI({ roomId }),
    onMutate: ({ roomId }) => {
      patchRoom(queryClient, roomId, (room) => ({ ...room, unreadCount: 0 }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unreadChatCountQueryKey });
      queryClient.invalidateQueries({ queryKey: activeChatRoomsQueryKey });
    },
  });
}

export function useMarkConversationUnread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId }: { roomId: string }) => markRoomAsUnreadAPI({ roomId }),
    onMutate: ({ roomId }) => {
      patchRoom(queryClient, roomId, (room) => ({
        ...room,
        unreadCount: Math.max(1, room.unreadCount || 0),
      }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unreadChatCountQueryKey });
      queryClient.invalidateQueries({ queryKey: activeChatRoomsQueryKey });
    },
  });
}

export function useToggleMuteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId }: { roomId: string }) => toggleMuteRoomAPI({ roomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activeChatRoomsQueryKey });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId }: { roomId: string }) => deleteConversationAPI({ roomId }),
    onMutate: ({ roomId }) => {
      queryClient.setQueriesData<RoomsCache>({ queryKey: activeChatRoomsQueryKey }, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.filter((room) => room.id !== roomId),
          })),
        };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unreadChatCountQueryKey });
      queryClient.invalidateQueries({ queryKey: activeChatRoomsQueryKey });
    },
  });
}
