/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from '@/apis/baseApi';
import { IChatRoomsDataType, IRoomMessageDataType } from './types/chat.interfaces';
import { IApiPaginationResponseWrapper, IPaginationParamsType } from '@/lib/types/interfaces';

export const createOrGetDirectRoomAPI = async ({ userId }: { userId: string }) => {
  try {
    const { data } = await baseApi.post<{ data: { id: string } }>(`/chat/direct-room/${userId}`);
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const createGroupChatAPI = async ({
  name,
  participantIds,
}: {
  name: string;
  participantIds: string[];
}) => {
  try {
    const { data } = await baseApi.post<{ data: { id: string } }>('/chat/group', {
      name,
      participantIds,
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const sendChatImageAPI = async ({ roomId, file }: { roomId: string; file: File }) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await baseApi.post<{ data: IRoomMessageDataType }>(
      `/chat/rooms/${roomId}/image`,
      formData,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const sendChatMessageAPI = async ({
  roomId,
  content,
}: {
  roomId: string;
  content: string;
}) => {
  try {
    const { data } = await baseApi.post<{ data: IRoomMessageDataType }>(
      `/chat/rooms/${roomId}/messages`,
      { content },
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getUnreadChatCountAPI = async () => {
  try {
    const { data } = await baseApi.get<{ data: { count: number } }>('/chat/unread-count');
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getMessageRequestsAPI = async ({ page = 1, limit = 20 }: IPaginationParamsType) => {
  try {
    const { data } = await baseApi.get<IApiPaginationResponseWrapper<IChatRoomsDataType>>(
      '/chat/message-requests',
      { params: { page, limit } },
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getMessageRequestCountAPI = async () => {
  try {
    const { data } = await baseApi.get<{ data: { count: number } }>('/chat/message-requests/count');
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const acceptMessageRequestAPI = async ({ roomId }: { roomId: string }) => {
  try {
    const { data } = await baseApi.post<{ data: { id: string } }>(`/chat/rooms/${roomId}/accept`);
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const rejectMessageRequestAPI = async ({ roomId }: { roomId: string }) => {
  try {
    const { data } = await baseApi.post<{ data: { success: boolean } }>(
      `/chat/rooms/${roomId}/reject`,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const markRoomAsReadAPI = async ({ roomId }: { roomId: string }) => {
  try {
    const { data } = await baseApi.post<{ data: { success: boolean } }>(
      `/chat/rooms/${roomId}/read`,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const markRoomAsUnreadAPI = async ({ roomId }: { roomId: string }) => {
  try {
    const { data } = await baseApi.post<{ data: { success: boolean } }>(
      `/chat/rooms/${roomId}/unread`,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const toggleMuteRoomAPI = async ({ roomId }: { roomId: string }) => {
  try {
    const { data } = await baseApi.post<{ data: { isMuted: boolean } }>(
      `/chat/rooms/${roomId}/mute`,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const deleteConversationAPI = async ({ roomId }: { roomId: string }) => {
  try {
    const { data } = await baseApi.delete<{ data: { success: boolean } }>(`/chat/rooms/${roomId}`);
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getActiveChatRoomsAPI = async () => {
  try {
    const { data } =
      await baseApi.get<IApiPaginationResponseWrapper<IChatRoomsDataType>>(`/chat/active-rooms`);
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getRoomMessagesAPI = async ({
  roomId,
  page = 1,
  limit = 10,
  before,
}: { roomId: string; before?: Date } & IPaginationParamsType) => {
  try {
    const { data } = await baseApi.get<IApiPaginationResponseWrapper<IRoomMessageDataType>>(
      `/chat/rooms/${roomId}/messages`,
      {
        params: {
          page,
          limit,
          before,
        },
      },
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};
