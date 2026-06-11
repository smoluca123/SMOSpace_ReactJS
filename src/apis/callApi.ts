/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from '@/apis/baseApi';
import type { ICallHistoryItem } from '@/apis/types/call.interfaces';
import { IApiPaginationResponseWrapper, IPaginationParamsType } from '@/lib/types/interfaces';

export type CallHistoryFilter = 'all' | 'audio' | 'video' | 'missed';

export const getCallHistoryAPI = async ({
  page = 1,
  limit = 20,
  filter = 'all',
}: IPaginationParamsType & { filter?: CallHistoryFilter }) => {
  try {
    const { data } = await baseApi.get<IApiPaginationResponseWrapper<ICallHistoryItem>>(
      '/call/history',
      { params: { page, limit, filter } },
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};
