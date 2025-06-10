/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from '@/apis/baseApi';
import {
  IApiPaginationResponseWrapper,
  IApiResponseWrapper,
  INotificationType,
  IPaginationParamsType,
} from '@/lib/types/interfaces';

export const getNotificationsAPI = async ({ page = 1, limit = 10 }: IPaginationParamsType) => {
  try {
    const { data } = await baseApi.get<IApiPaginationResponseWrapper<INotificationType>>(
      '/notification',
      {
        params: {
          page,
          limit,
        },
      },
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const changeNotificationStatusAPI = async ({
  notificationId,
  isRead,
}: {
  notificationId: string;
  isRead: boolean;
}) => {
  try {
    const { data } = await baseApi.patch<IApiResponseWrapper<INotificationType>>(
      `/notification/status/${notificationId}`,
      {
        isRead,
      },
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};
