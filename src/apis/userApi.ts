/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from '@/apis/baseApi';
import { IUpdateInfomationType } from '@/apis/types/interfaces';
import {
  IApiPaginationResponseWrapper,
  IApiResponseWrapper,
  IFollowerType,
  IFollowingType,
  IFollowUserType,
  IFriendRequestWithFriendDataType,
  IFriendRequestWithUserDataType,
  IPaginationParamsType,
  IUserCountDataType,
  IUserDataType,
  IUserDataWithFollowedStatusType,
  IUserTypeType,
  IUserWithAccessTokenType,
} from '@/lib/types/interfaces';
import { AdminCreateUserType, LoginValues, RegisterValues } from '@/lib/validations';
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
  currentUserId,
}: {
  userId: UUID | string;
  currentUserId?: UUID;
}) => {
  try {
    const { data } = await baseApi.get<IApiResponseWrapper<IUserDataWithFollowedStatusType>>(
      `/user/${userId}`,
      {
        params: {
          currentUserId,
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
  currentUserId,
}: {
  userId?: UUID;
  page?: number;
  limit?: number;
  keywords?: string;
  currentUserId?: UUID;
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
        currentUserId,
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
    const { data } = await baseApi.patch<IApiResponseWrapper<IUserDataType>>('/user/me', newData);
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

export const updateCoverImageAPI = async ({
  userId,
  imageFile,
}: {
  userId: UUID;
  imageFile: File;
}) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const { data } = await baseApi.post<IApiResponseWrapper<IUserDataType>>(
      `/user/cover-image/${userId}`,
      formData,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const sendVerificationCodeToEmamilAPI = async ({ userId }: { userId: UUID }) => {
  try {
    const { data } = await baseApi.post<IApiResponseWrapper<undefined>>(
      '/user/active/send-verification-email/' + userId,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const activeAccountAPI = async ({
  userId,
  verifyCode,
}: {
  userId: UUID;
  verifyCode: string;
}) => {
  try {
    const { data } = await baseApi.post<IApiResponseWrapper<IUserDataType>>(
      '/user/active/' + userId,
      {
        verifyCode,
      },
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const sendResetPasswordCodeToEmailAPI = async ({ userEmail }: { userEmail: string }) => {
  try {
    const { data } = await baseApi.post<IApiResponseWrapper<null>>(
      '/user/forgot-password/send-verification-email/' + userEmail,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const resetPasswordAPI = async ({
  userEmail,
  verifyCode,
  password,
}: {
  userEmail: string;
  verifyCode: string;
  password: string;
}) => {
  try {
    const { data } = await baseApi.post<IApiResponseWrapper<IUserDataType>>(
      '/user/forgot-password/' + userEmail,
      {
        verifyCode,
        password,
      },
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getMyFriendRequestsAPI = async ({ limit = 10, page = 1 }: IPaginationParamsType) => {
  try {
    const { data } = await baseApi.get<
      IApiPaginationResponseWrapper<IFriendRequestWithFriendDataType>
    >('/user/friends/pending', {
      params: {
        limit,
        page,
      },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const changeFriendRequestStatusAPI = async ({
  userId,
  status,
}: {
  userId: UUID;
  status: 'ACCEPTED' | 'REJECTED';
}) => {
  try {
    const { data } = await baseApi.post<
      IApiResponseWrapper<IFriendRequestWithUserDataType & IFriendRequestWithFriendDataType>
    >('/user/friend/status/' + userId, {
      status,
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const acceptFriendRequestAPI = async ({ userId }: { userId: UUID }) => {
  try {
    return await changeFriendRequestStatusAPI({ userId, status: 'ACCEPTED' });
  } catch (error) {
    throw new Error(error as string);
  }
};

export const cancelFriendRequestAPI = async ({ userId }: { userId: UUID }) => {
  try {
    return await changeFriendRequestStatusAPI({ userId, status: 'REJECTED' });
  } catch (error) {
    throw new Error(error as string);
  }
};

export const deleteFriendAPI = async ({ userId }: { userId: UUID }) => {
  try {
    const { data } = await baseApi.delete<
      IApiResponseWrapper<IFriendRequestWithFriendDataType & IFriendRequestWithUserDataType>
    >('/user/friend/' + userId);
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getMyFriendsAPI = async ({ page, limit }: IPaginationParamsType) => {
  try {
    const { data } = await baseApi.get<
      IApiPaginationResponseWrapper<IUserDataType> & {
        user: IUserDataType;
      }
    >('/user/friends', {
      params: {
        page,
        limit,
      },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getUserFriendsAPI = async ({
  userId,
  page,
  limit,
}: IPaginationParamsType & { userId: UUID }) => {
  try {
    const { data } = await baseApi.get<
      IApiPaginationResponseWrapper<IUserDataType> & {
        user: IUserDataType;
      }
    >(`/user/friends/${userId}`, {
      params: {
        page,
        limit,
      },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getFriendByUserIdAPI = async ({ userId }: { userId: UUID }) => {
  try {
    const { data } = await baseApi.get<IApiResponseWrapper<IUserDataType>>(
      `/user/friend/get-friend/${userId}`,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const deleteUserAPI = async (userId: UUID) => {
  try {
    const { data } = await baseApi.delete<IApiResponseWrapper<IUserDataType>>('/user/' + userId);
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const adminToggleBanUserAPI = async ({
  userId,
  isBanned,
}: {
  userId: UUID;
  isBanned: boolean;
}) => {
  try {
    const { data } = await baseApi.patch<IApiResponseWrapper<IUserDataType>>(
      '/user/ban/' + userId,
      {
        isBanned,
      },
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const adminUpdateUserInfomationAPI = async ({
  userId,
  newUserData,
}: {
  userId: UUID;
  newUserData: IUpdateInfomationType;
}) => {
  try {
    const { data } = await baseApi.patch<IApiResponseWrapper<IUserDataType>>(
      '/user/' + userId,
      newUserData,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const adminToggleBanUsers = async (banList: { userId: UUID; isBanned: boolean }[]) => {
  try {
    const { data } = await baseApi.patch<IApiResponseWrapper<IUserDataType[]>>('/user/ban/users', {
      banList,
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getAllUsersAPI = async (
  params?: IPaginationParamsType & { keywords?: string; currentUserId?: string },
) => {
  try {
    const { data } = await baseApi.get<IApiPaginationResponseWrapper<IUserDataType>>('/user', {
      params: {
        ...params,
      },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getUserCountAPI = async () => {
  try {
    const { data } = await baseApi.get<IApiResponseWrapper<IUserCountDataType>>('/user/count');
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const adminCreateUserAPI = async (credentials: AdminCreateUserType) => {
  try {
    const { data } = await baseApi.post<IApiResponseWrapper<IUserDataType>>(
      '/user/admin/create-user',
      credentials,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getUserTypeList = async () => {
  try {
    const { data } = await baseApi.get<IApiResponseWrapper<IUserTypeType[]>>('/user/types');
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};
