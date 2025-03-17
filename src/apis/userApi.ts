/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from '@/apis/baseApi';
import { IUpdateInfomationType } from '@/apis/types/interfaces';
import {
  IApiPaginationResponseWrapper,
  IApiResponseWrapper,
  IFollowerType,
  IFollowingType,
  IFollowUserType,
  IPaginationParamsType,
  IUserDataType,
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

export const getUserFollowersAPI = async ({
  userId,
  page,
  limit,
}: IPaginationParamsType & { userId: UUID | string }): Promise<
  IApiPaginationResponseWrapper<IFollowerType>
> => {
  try {
    const { data } = await baseApi.get<IApiPaginationResponseWrapper<IFollowerType>>(
      `/user/followers/${userId}`,
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

export const getUserFollowingsAPI = async ({
  userId,
  page,
  limit,
}: IPaginationParamsType & { userId: UUID | string }): Promise<
  IApiPaginationResponseWrapper<IFollowingType>
> => {
  try {
    const { data } = await baseApi.get<IApiPaginationResponseWrapper<IFollowingType>>(
      `/user/followings/${userId}`,
      {
        params: {
          page,
          limit,
        },
      },
    );
    console.log(data);
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

export const getAllUsersInfomationAPI = async ({
  userId,
  page = 1,
  limit = 10,
  keywords,
  followerId,
}: {
  userId?: UUID;
  page?: number;
  limit?: number;
  keywords?: string;
  followerId?: UUID;
}) => {
  try {
    const { data } = await baseApi.get<
      IApiPaginationResponseWrapper<IUserDataWithFollowedStatusType>
    >('/user', {
      params: {
        userId,
        page,
        limit,
        keywords,
        followerId,
      },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const updateInfomationAPI = async (newData: IUpdateInfomationType) => {
  try {
    const { data } = await baseApi.put<IApiResponseWrapper<IUserDataType>>('/user/me', newData);
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const updateAvatarAPI = async ({ userId, imageFile }: { userId: UUID; imageFile: File }) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const { data } = await baseApi.post<IApiResponseWrapper<IUserDataType>>(
      `/user/avatar/${userId}`,
      formData,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};
