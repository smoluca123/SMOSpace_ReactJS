import { submitPostAPI } from '@/apis/postApi';
import {
  IApiPaginationResponseWrapper,
  IPostDataWithLikedStatusType,
} from '@/lib/types/interfaces';
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';

export function useSubmitPostMutaion() {
  const queryClient = useQueryClient();

  const submitPost = async ({ content, isPrivate }: { content: string; isPrivate?: boolean }) => {
    try {
      const data = await submitPostAPI({
        content,
        isPrivate,
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
      const queryFilter: QueryFilters<
        InfiniteData<
          IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data'],
          number | undefined
        >
      > = {
        queryKey: ['posts'],
      };
      console.log(queryFilter);
      queryClient.setQueriesData(queryFilter, (oldData) => {
        console.log(oldData);
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
        console.log(updatedFirstPage);
        return {
          pageParams: oldData.pageParams,
          pages: [updatedFirstPage, ...oldData.pages.slice(1)],
        };
      });
    },
  });
  return mutation;
}
