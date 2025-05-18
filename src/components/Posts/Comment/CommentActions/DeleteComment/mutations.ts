import { deleteCommentAPI } from '@/apis/postApi';
import { IApiPaginationResponseWrapper, ICommentDataType } from '@/lib/types/interfaces';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  const deleteComment = async ({ commentId }: { commentId: UUID }) => {
    try {
      const { data } = await deleteCommentAPI({ commentId });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (responseData) => {
      const queryFilter = {
        queryKey: ['comments'],
      };

      await queryClient.cancelQueries(queryFilter);

      // update the comment list
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<ICommentDataType>['data']>
      >(queryFilter, (data) => {
        if (!data) return;
        return {
          pageParams: data.pageParams,
          pages: data.pages.map((page) => {
            if (responseData.replyToId) {
              const parentCommentIndex = page.items.findIndex(
                (comment) => comment.id === responseData.replyToId,
              );
              if (parentCommentIndex !== -1) {
                page.items[parentCommentIndex].repliesCount -= 1;
              }
            }

            const hasComment = page.items.some((comment) => comment.id === responseData.id);
            if (hasComment) {
              return {
                ...page,
                items: page.items.filter((comment) => comment.id !== responseData.id),
              };
            }
            return page;
          }),
        };
      });

      // update the comment count
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<ICommentDataType>['data']>
      >(queryFilter, (data) => {
        if (!data) return;
        return {
          ...data,
        };
      });
    },
  });

  return mutation;
};
