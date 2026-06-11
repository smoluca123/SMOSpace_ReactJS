/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from '@/apis/baseApi';
import {
  IApiPaginationResponseWrapper,
  IApiResponseWrapper,
  IPaginationParamsType,
  IUserDataType,
} from '@/lib/types/interfaces';

export interface IStoryDataType {
  id: string;
  mediaUrl: string;
  type: 'IMAGE' | 'VIDEO';
  thumbnailUrl: string | null;
  duration: number | null;
  viewCount: number;
  createdAt: string;
  expiresAt: string;
  author: IUserDataType;
  isViewed: boolean;
}

export interface IStoryGroupType {
  author: IUserDataType;
  stories: IStoryDataType[];
  hasUnviewed: boolean;
  latestAt: string;
}

export interface IStoryViewersType {
  viewCount: number;
  viewers: IUserDataType[];
}

type PresignSingle = { mode: 'single'; key: string; url: string };
type PresignMultipart = {
  mode: 'multipart';
  key: string;
  uploadId: string;
  partSize: number;
  urls: { partNumber: number; url: string }[];
};
type PresignResult = PresignSingle | PresignMultipart;

const presignStoryUploadAPI = async (body: {
  filename: string;
  contentType: string;
  size: number;
}) => {
  const { data } = await baseApi.post<{ data: PresignResult }>('/story/upload/presign', body);
  return data.data;
};

const completeStoryUploadAPI = async (body: {
  key: string;
  uploadId: string;
  parts: { partNumber: number; etag: string }[];
}) => {
  const { data } = await baseApi.post<{ data: { success: boolean } }>(
    '/story/upload/complete',
    body,
  );
  return data.data;
};

/** PUT a blob to a presigned URL with upload progress; resolves the ETag. */
function putWithProgress(
  url: string,
  body: Blob,
  contentType: string | null,
  onProgress: (loaded: number) => void,
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    if (contentType) xhr.setRequestHeader('Content-Type', contentType);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.getResponseHeader('ETag'));
      } else {
        reject(new Error(`Upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(body);
  });
}

/**
 * Upload a story file directly to storage (Storj) via presigned URLs.
 * Small files use a single PUT; large files use multipart. Returns the object
 * key + detected media type so the caller can create the story record.
 */
export async function uploadStoryToStorj(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<{ key: string; type: 'IMAGE' | 'VIDEO' }> {
  const type: 'IMAGE' | 'VIDEO' = file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE';

  const presign = await presignStoryUploadAPI({
    filename: file.name,
    contentType: file.type,
    size: file.size,
  });

  if (presign.mode === 'single') {
    await putWithProgress(presign.url, file, file.type, (loaded) =>
      onProgress?.(Math.round((loaded / file.size) * 100)),
    );
    return { key: presign.key, type };
  }

  // Multipart: upload each part, aggregate progress, collect ETags.
  const { partSize, urls, key, uploadId } = presign;
  const parts: { partNumber: number; etag: string }[] = [];
  let uploadedBytes = 0;

  for (const { partNumber, url } of urls) {
    const start = (partNumber - 1) * partSize;
    const end = Math.min(start + partSize, file.size);
    const blob = file.slice(start, end);

    let lastLoaded = 0;
    const etag = await putWithProgress(url, blob, null, (loaded) => {
      uploadedBytes += loaded - lastLoaded;
      lastLoaded = loaded;
      onProgress?.(Math.round((uploadedBytes / file.size) * 100));
    });

    if (!etag) {
      throw new Error('Missing ETag from upload (check storage CORS ExposeHeaders)');
    }
    parts.push({ partNumber, etag });
  }

  await completeStoryUploadAPI({ key, uploadId, parts });
  return { key, type };
}

export const createStoryAPI = async ({
  key,
  type,
  duration,
}: {
  key: string;
  type: 'IMAGE' | 'VIDEO';
  duration?: number;
}) => {
  try {
    const { data } = await baseApi.post<IApiResponseWrapper<IStoryDataType>>('/story', {
      key,
      type,
      duration,
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getStoryFeedAPI = async ({ page = 1, limit = 15 }: IPaginationParamsType) => {
  try {
    const { data } = await baseApi.get<IApiPaginationResponseWrapper<IStoryGroupType>>(
      '/story/feed',
      { params: { page, limit } },
    );
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getUserStoriesAPI = async ({ userId }: { userId: string }) => {
  try {
    const { data } = await baseApi.get<{ data: IStoryDataType[] }>(`/story/user/${userId}`);
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const viewStoryAPI = async ({ storyId }: { storyId: string }) => {
  try {
    const { data } = await baseApi.post<{ data: { success: boolean } }>(`/story/view/${storyId}`);
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const getStoryViewersAPI = async ({ storyId }: { storyId: string }) => {
  try {
    const { data } = await baseApi.get<{ data: IStoryViewersType }>(`/story/viewers/${storyId}`);
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const deleteStoryAPI = async ({ storyId }: { storyId: string }) => {
  try {
    const { data } = await baseApi.delete<{ data: { success: boolean } }>(`/story/${storyId}`);
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};
