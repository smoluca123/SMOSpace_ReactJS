import baseApi from '@/apis/baseApi';
import {
  IApiPaginationResponseWrapper,
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
  } catch (error) {
    throw new Error(error as string);
  }
};
