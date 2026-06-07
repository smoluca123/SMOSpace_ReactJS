import { markRoomAsReadAPI, sendChatMessageAPI } from '@/apis/chatApi';
import { IRoomMessageDataType } from '@/apis/types/chat.interfaces';
import { toast } from '@/hooks/use-toast';
import { chatSocket } from '@/lib/sockets';
import { IApiPaginationResponseWrapper } from '@/lib/types/interfaces';
import { activeChatRoomsQueryKey } from '@/modules/chat/components/Conversation/querys';
import {
  messageRequestCountQueryKey,
  messageRequestsQueryKey,
} from '@/modules/chat/components/Conversation/requestQuerys';
import { getRoomsMessagesQueryKey } from '@/modules/chat/components/Message/querys';
import { unreadChatCountQueryKey } from '@/modules/chat/querys';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

/** True when the user is currently viewing the given room. */
function isViewingRoom(roomId: string) {
  return window.location.pathname === `/chat/${roomId}`;
}

/** Append a message to the cached message list of its room (deduped). */
function appendMessageToCache(
  queryClient: ReturnType<typeof useQueryClient>,
  message: IRoomMessageDataType,
) {
  const roomId = message.room?.id;
  if (!roomId) return;

  queryClient.setQueryData<
    InfiniteData<IApiPaginationResponseWrapper<IRoomMessageDataType>['data']>
  >(getRoomsMessagesQueryKey({ roomId }), (oldData) => {
    if (!oldData) return oldData;
    const exists = oldData.pages.some((page) => page.items.some((item) => item.id === message.id));
    if (exists) return oldData;

    const lastIndex = oldData.pages.length - 1;
    return {
      ...oldData,
      pages: oldData.pages.map((page, index) =>
        index === lastIndex ? { ...page, items: [...page.items, message] } : page,
      ),
    };
  });
}

/**
 * Global chat listener - mount once (e.g. in App).
 * Connects the chat socket, subscribes to the personal room and handles
 * incoming messages everywhere: live append, toast notifications and the
 * unread-count badge.
 */
export function useGlobalChatNotifications() {
  const queryClient = useQueryClient();
  const { user } = useAppSelector(selectAuth);

  useEffect(() => {
    chatSocket.connect();

    const subscribe = () => chatSocket.emit('chat:subscribe');

    // Live append for rooms the user is currently viewing
    const handleNewMessage = (message: IRoomMessageDataType) => {
      appendMessageToCache(queryClient, message);
      queryClient.invalidateQueries({ queryKey: activeChatRoomsQueryKey });

      // Keep the open room marked as read (but never auto-read a pending request)
      const isPendingRequest = message.room?.status === 'PENDING' && message.sender.id !== user?.id;
      if (message.room?.id && isViewingRoom(message.room.id) && !isPendingRequest) {
        markRoomAsReadAPI({ roomId: message.room.id }).then(() => {
          queryClient.invalidateQueries({ queryKey: unreadChatCountQueryKey });
        });
      }
    };

    // Notification for messages in rooms the user is NOT viewing
    const handleNotification = (message: IRoomMessageDataType) => {
      // Pending request from a stranger: route to "message requests", no toast/unread
      if (message.room?.status === 'PENDING' && message.sender.id !== user?.id) {
        queryClient.invalidateQueries({ queryKey: messageRequestsQueryKey });
        queryClient.invalidateQueries({ queryKey: messageRequestCountQueryKey });
        return;
      }

      queryClient.invalidateQueries({ queryKey: unreadChatCountQueryKey });
      queryClient.invalidateQueries({ queryKey: activeChatRoomsQueryKey });

      if (message.room?.id && isViewingRoom(message.room.id)) return;

      // Respect muted conversations - no toast
      const myParticipant = message.room?.participants?.find((p) => p.user.id === user?.id);
      if (myParticipant?.isMuted) return;

      toast({
        title: `New message from ${message.sender.fullName || message.sender.username}`,
        description: message.type === 'IMAGE' ? 'Sent an image' : message.content,
        duration: 4000,
      });
    };

    if (chatSocket.connected) subscribe();
    chatSocket.on('connect', subscribe);
    chatSocket.on('newMessage', handleNewMessage);
    chatSocket.on('chat:newMessageNotification', handleNotification);

    return () => {
      chatSocket.off('connect', subscribe);
      chatSocket.off('newMessage', handleNewMessage);
      chatSocket.off('chat:newMessageNotification', handleNotification);
    };
  }, [queryClient, user?.id]);
}

/**
 * Per-room chat controls - mount inside the open conversation.
 * Joins the room (for typing broadcast), sends messages, broadcasts typing
 * state and marks the room as read on open.
 */
export function useChatSocket({
  roomId,
  autoMarkRead = true,
  enabled = true,
}: {
  roomId: string;
  autoMarkRead?: boolean;
  enabled?: boolean;
}) {
  const queryClient = useQueryClient();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!roomId || !enabled) return;

    chatSocket.connect();

    const joinRoom = () => chatSocket.emit('joinRoom', { roomId });

    const handleTyping = (data: { roomId: string; typingUsers: string[] }) => {
      if (data.roomId === roomId) setTypingUsers(data.typingUsers);
    };

    // Someone read the room - add them to readBy of every cached message (read receipts)
    const handleMessagesRead = (data: { roomId: string; userId: string }) => {
      if (data.roomId !== roomId) return;

      queryClient.setQueryData<
        InfiniteData<IApiPaginationResponseWrapper<IRoomMessageDataType>['data']>
      >(getRoomsMessagesQueryKey({ roomId }), (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.readBy.includes(data.userId)
                ? item
                : { ...item, readBy: [...item.readBy, data.userId] },
            ),
          })),
        };
      });
    };

    if (chatSocket.connected) joinRoom();
    chatSocket.on('connect', joinRoom);
    chatSocket.on('typingStatus', handleTyping);
    chatSocket.on('messagesRead', handleMessagesRead);

    // Mark the room as read when opened (skipped for pending requests in preview)
    if (autoMarkRead) {
      markRoomAsReadAPI({ roomId })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: unreadChatCountQueryKey });
          queryClient.invalidateQueries({ queryKey: activeChatRoomsQueryKey });
        })
        .catch(() => {});
    }

    return () => {
      chatSocket.emit('leaveRoom', { roomId });
      chatSocket.off('connect', joinRoom);
      chatSocket.off('typingStatus', handleTyping);
      chatSocket.off('messagesRead', handleMessagesRead);
      setTypingUsers([]);
    };
  }, [roomId, queryClient, autoMarkRead, enabled]);

  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      const trimmed = content.trim();
      if (!trimmed || !roomId) throw new Error('Empty message');
      // Persist via REST (saved to DB), the server then broadcasts over socket.
      await sendChatMessageAPI({ roomId, content: trimmed });
    },
    [roomId],
  );

  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!roomId) return;
      chatSocket.emit('typing', { roomId, isTyping });
    },
    [roomId],
  );

  return { sendMessage, setTyping, typingUsers };
}
