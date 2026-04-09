/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from '@/apis/baseApi';
import {
  IApiPaginationResponseWrapper,
  IApiResponseWrapper,
  IGroupedNotificationType,
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

export interface IGetGroupedNotificationsParams extends IPaginationParamsType {
  groupByTime?: number;
}

export const getGroupedNotificationsAPI = async ({
  page = 1,
  limit = 10,
  groupByTime = 24,
}: IGetGroupedNotificationsParams) => {
  try {
    const { data } = await baseApi.get<IApiPaginationResponseWrapper<IGroupedNotificationType>>(
      '/notification/grouped',
      {
        params: {
          page,
          limit,
          groupByTime,
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

export const markGroupAsReadAPI = async ({
  notificationIds,
  isRead,
}: {
  notificationIds: string[];
  isRead: boolean;
}) => {
  try {
    const { data } = await baseApi.patch<IApiResponseWrapper<null>>('/notification/group/status', {
      notificationIds,
      isRead,
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};
