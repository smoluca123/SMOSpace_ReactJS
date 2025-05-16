import { submitPostAPI } from '@/apis/postApi';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import {
  IApiPaginationResponseWrapper,
  IPostDataWithLikedStatusType,
} from '@/lib/types/interfaces';
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';

export function useSubmitPostMutaion() {
  const queryClient = useQueryClient();
  const { update: updateUserInfomation } = useUpdateDataInfomation();

  const submitPost = async ({
    content,
    isPrivate,
    images,
  }: {
    content: string;
    isPrivate?: boolean;
    images: File[];
  }) => {
    try {
      const data = await submitPostAPI({
        content,
        isPrivate,
        images,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: (newPost) => {
      const postsQueryFilter: QueryFilters<
        InfiniteData<
          IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data'],
          number | undefined
        >
      > = {
        queryKey: ['posts'],
      };

      // update the first page of the posts query
      queryClient.setQueriesData(postsQueryFilter, (oldData) => {
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
