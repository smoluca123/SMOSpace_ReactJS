import baseApi from '@/apis/baseApi';
import {
  IApiPaginationResponseWrapper,
  IApiResponseWrapper,
  IGeneratePostResponseType,
  IPostDataWithLikedStatusType,
} from '@/lib/types/interfaces';
import { UUID } from 'crypto';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAllPostsAPI = async ({
  userId,
  page = 1,
  limit = 2,
  keywords,
}: {
  userId?: UUID;
  page?: number;
  limit?: number;
  keywords?: string;
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
