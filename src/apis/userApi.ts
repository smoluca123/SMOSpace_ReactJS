/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from '@/apis/baseApi';
import {
  IApiPaginationResponseWrapper,
  IApiResponseWrapper,
  IFollowerType,
  IFollowUserType,
  IPaginationParamsType,
  IUserDataWithFollowedStatusType,
  IUserWithAccessTokenType,
} from '@/lib/types/interfaces';
import { LoginValues, RegisterValues } from '@/lib/validations';
import { UUID } from 'crypto';

export const loginAPI = async (
  credentials: LoginValues,
): Promise<IApiResponseWrapper<IUserWithAccessTokenType>> => {
  try {
    const { data } = await baseApi.post<IApiResponseWrapper<IUserWithAccessTokenType>>(
      '/auth/login',
      credentials,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const registerAPI = async (
  credentials: RegisterValues,
): Promise<IApiResponseWrapper<IUserWithAccessTokenType>> => {
  try {
    const { data } = await baseApi.post<IApiResponseWrapper<IUserWithAccessTokenType>>(
      '/auth/register',
      credentials,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getMyFollowersAPI = async ({
  page,
  limit,
}: IPaginationParamsType): Promise<IApiPaginationResponseWrapper<IFollowerType>> => {
  try {
    const { data } = await baseApi.get<IApiPaginationResponseWrapper<IFollowerType>>(
      '/user/followers',
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

export const getMyInfomationAPI = async (): Promise<
  IApiResponseWrapper<IUserWithAccessTokenType>
> => {
  try {
    const { data } = await baseApi.get<IApiResponseWrapper<IUserWithAccessTokenType>>('/user/me');
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getUserInfomationAPI = async ({
  userId,
  followerId,
}: {
  userId: UUID | string;
  followerId?: UUID;
}) => {
  try {
    const { data } = await baseApi.get<IApiResponseWrapper<IUserDataWithFollowedStatusType>>(
      `/user/${userId}`,
      {
        params: {
          followerId,
        },
      },
    );

    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const followUserAPI = async ({ userId }: { userId: UUID }) => {
  try {
    const { data } = await baseApi.post<IApiResponseWrapper<IFollowUserType>>(
      '/user/follow/' + userId,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};
