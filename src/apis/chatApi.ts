/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from '@/apis/baseApi';
import { IChatRoomsDataType, IRoomMessageDataType } from './types/chat.interfaces';
import { IApiPaginationResponseWrapper, IPaginationParamsType } from '@/lib/types/interfaces';

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
