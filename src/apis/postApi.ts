import baseApi from '@/apis/baseApi';
import {
  IApiPaginationResponseWrapper,
  IApiResponseWrapper,
  IGeneratePostResponseType,
  IPaginationParamsType,
  IPostDataType,
  IPostDataWithLikedStatusType,
  IPostLikeType,
  ITrendingTopicType,
} from '@/lib/types/interfaces';
import { UUID } from 'crypto';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAllPostsAPI = async ({
  userId,
  page = 1,
  limit = 10,
  keywords,
  likeUserId,
}: {
  userId?: UUID;
  page?: number;
  limit?: number;
  keywords?: string;
  likeUserId?: UUID;
}) => {
  try {
    const { data } = await baseApi.get<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>>(
      '/post',
      {
        params: {
          userId,
          page,
          limit,
          keywords,
          likeUserId,
        },
      },
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const submitPostAPI = async ({
  content,
  isPrivate = false,
}: {
  content: string;
  isPrivate?: boolean;
}) => {
  try {
    const { data } = await baseApi.post<IApiResponseWrapper<IPostDataType>>('/post', {
      content,
      isPrivate,
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const generatePostAPI = async ({ prompt }: { prompt: string }) => {
  try {
    const data = await baseApi.post<IApiResponseWrapper<IGeneratePostResponseType>>(
      'post/ai/generate-post',
      { prompt },
    );

    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getTrendingTopicsAPI = async () => {
  try {
    const { data } = await baseApi.get<IApiResponseWrapper<ITrendingTopicType[]>>('/post/trending');
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const likePostAPI = async ({ postId }: { postId: UUID }) => {
  try {
    const { data } = await baseApi.post<IApiResponseWrapper<IPostDataWithLikedStatusType>>(
      `/post/like/${postId}`,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getLikedUsersAPI = async ({
  postId,
  page = 1,
  limit = 10,
}: IPaginationParamsType & { postId: UUID }) => {
  try {
    const { data } = await baseApi.get<
      IApiPaginationResponseWrapper<IPostLikeType> & {
        post: IPostDataType;
      }
    >(`/post/get-likes/${postId}`, {
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

export const deletePostAPI = async ({ postId }: { postId: UUID }) => {
  try {
    const { data } = await baseApi.delete<IApiResponseWrapper<IPostDataType>>(`/post/${postId}`);
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const updatePostAPI = async ({
  postId,
  content,
  isPrivate,
}: {
  postId: UUID;
  content: string;
  isPrivate: boolean;
}) => {
  try {
    const { data } = await baseApi.put<IApiResponseWrapper<IPostDataType>>(`/post/${postId}`, {
      content,
      isPrivate,
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};
