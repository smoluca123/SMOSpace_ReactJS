import { submitPostAPI } from '@/apis/postApi';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import {
  IApiPaginationResponseWrapper,
  IPostDataWithLikedStatusType,
} from '@/lib/types/interfaces';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useSubmitPostMutation() {
  const queryClient = useQueryClient();
  const { update: updateUserInfomation } = useUpdateDataInfomation();

  const submitPost = async ({
    content,
    isPrivate,
    images,
    mentionedUserIds,
  }: {
    content: string;
    isPrivate?: boolean;
    images: File[];
    mentionedUserIds?: string[];
  }) => {
    try {
      const data = await submitPostAPI({
        content,
        isPrivate,
        images,
        mentionedUserIds,
      });
      return data;
    } catch (error) {
      console.error('Failed to submit post:', error);
      throw error instanceof Error ? error : new Error('Failed to submit post');
    }
  };

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: (newPost) => {
      const postsQueryFilter = {
        queryKey: QUERY_KEYS.POSTS,
      };

      // update the first page of the posts query
      queryClient.setQueriesData<
        InfiniteData<
          IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data'],
          number | undefined
        >
      >(postsQueryFilter, (oldData) => {
        if (!oldData) return oldData;

        const firstPage = oldData.pages[0];
        const updatedFirstPage = {
          ...firstPage,
          items: [
            {
              ...newPost.data,
              isLiked: false,
            },
            ...firstPage.items,
          ],
        };

        return {
          pageParams: oldData.pageParams,
          pages: [updatedFirstPage, ...oldData.pages.slice(1)],
        };
      });

      // update the user data in the query cache
      updateUserInfomation({ data: newPost.data.author });
    },
  });
  return mutation;
}
