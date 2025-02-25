import { updateCommentAPI } from '@/apis/postApi';
import { getCommentsQueryKey } from '@/components/Posts/Comment/querys';
import { toast } from '@/hooks/use-toast';
import { IApiPaginationResponseWrapper, ICommentDataType } from '@/lib/types/interfaces';
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

export function useEditCommentMutation() {
  const queryClient = useQueryClient();

  const editComment = async ({ commentId, content }: { commentId: UUID; content: string }) => {
    try {
      const response = await updateCommentAPI({
        commentId,
        content,
      });
      return response.data;
    } catch (error) {
      throw new Error(error as string);
    }
  };
  const mutation = useMutation({
    mutationFn: editComment,
    onSuccess: (responseData) => {
      const queryFilter: QueryFilters<
        InfiniteData<IApiPaginationResponseWrapper<ICommentDataType>['data']>
      > = {
        queryKey: getCommentsQueryKey({
          postId: responseData.post.id,
          replyTo: responseData.replyToId ?? undefined,
        }),
      };

      // update the comment list
      queryClient.setQueriesData(queryFilter, (data) => {
        if (!data) return;

        return {
          pageParams: data.pageParams,
          pages: data.pages.map((page) => {
            const hasComment = page.items.some((comment) => comment.id === responseData.id);
            if (hasComment) {
              return {
                ...page,
                items: page.items.map((comment) => {
                  if (comment.id === responseData.id) {
                    return responseData;
                  }
                  return comment;
                }),
              };
            }
            return page;
          }),
        };
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
      });
    },
  });

  return mutation;
}
