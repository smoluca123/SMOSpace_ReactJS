import baseApi from '@/apis/baseApi';
import {
  IApiPaginationResponseWrapper,
  IApiResponseWrapper,
  IGeneratePostResponseType,
  IPostDataWithLikedStatusType,
  ITrendingTopicType,
} from '@/lib/types/interfaces';
import { UUID } from 'crypto';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAllPostsAPI = async (params: { userId?: UUID }) => {
  try {
    const { data } = await baseApi.get<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>>(
      '/post',
      {
        params,
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
    const { data } = await baseApi.post('/post', {
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
