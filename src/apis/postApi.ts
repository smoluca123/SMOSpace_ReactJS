import baseApi from '@/apis/baseApi';
import {
  IApiPaginationResponseWrapper,
  IApiResponseWrapper,
  ICommentDataType,
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

export const getPostAPI = async ({ postId, likeUserId }: { postId: UUID; likeUserId?: UUID }) => {
  try {
    const { data } = await baseApi.get<IApiResponseWrapper<IPostDataWithLikedStatusType>>(
      `/post/${postId}`,
      {
        params: {
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

export const getFollowingPostsAPI = async ({
  page = 1,
  limit = 10,
  keywords,
  likeUserId,
}: {
  page?: number;
  limit?: number;
  keywords?: string;
  likeUserId?: UUID;
}) => {
  try {
    const { data } = await baseApi.get<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>>(
      '/post/following-posts',
      {
        params: {
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

export const getMyPostsAPI = async ({
  page = 1,
  limit = 10,
  keywords,
}: {
  page?: number;
  limit?: number;
  keywords?: string;
}) => {
  try {
    const { data } = await baseApi.get<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>>(
      '/post/my-posts',
      {
        params: {
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
  images,
}: {
  content: string;
  isPrivate?: boolean;
  images: File[];
}) => {
  try {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('isPrivate', isPrivate.toString());
    images.forEach((file) => {
      formData.append('images', file);
    });
    const { data } = await baseApi.post<IApiResponseWrapper<IPostDataType>>('/post', formData);
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
    const { data } = await baseApi.patch<IApiResponseWrapper<IPostDataType>>(`/post/${postId}`, {
      content,
      isPrivate,
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getCommentsAPI = async ({
  postId,
  page = 1,
  limit = 10,
  replyTo,
}: IPaginationParamsType & { postId: UUID; replyTo?: UUID }) => {
  try {
    const { data } = await baseApi.get<IApiPaginationResponseWrapper<ICommentDataType>>(
      `/post/comment/${postId}`,
      { params: { page, limit, replyTo } },
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const submitCommentAPI = async ({
  postId,
  content,
  replyTo,
}: {
  postId: UUID;
  content: string;
  replyTo?: UUID;
}) => {
  try {
    const { data } = await baseApi.post<IApiResponseWrapper<ICommentDataType>>(
      `/post/comment/${postId}`,
      {
        content,
        replyToId: replyTo,
      },
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const updateCommentAPI = async ({
  commentId,
  content,
}: {
  commentId: UUID;
  content: string;
}) => {
  try {
    const { data } = await baseApi.patch<IApiResponseWrapper<ICommentDataType>>(
      `/post/comment/${commentId}`,
      { content },
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const deleteCommentAPI = async ({ commentId }: { commentId: UUID }) => {
  try {
    const { data } = await baseApi.delete<IApiResponseWrapper<ICommentDataType>>(
      `/post/comment/${commentId}`,
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};
