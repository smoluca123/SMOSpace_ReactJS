import { submitCommentAPI } from '@/apis/postApi';
import { getCommentsQueryKey } from '@/components/Posts/Comment/querys';
import { IApiPaginationResponseWrapper, ICommentDataType } from '@/lib/types/interfaces';
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

export function useSubmitCommentMutation({ isShowReplies }: { isShowReplies?: boolean }) {
  const queryClient = useQueryClient();

  const submitComment = async ({
    postId,
    content,
    replyTo,
  }: {
    postId: UUID;
    content: string;
    replyTo?: UUID;
  }) => {
    try {
      const { data } = await submitCommentAPI({ postId, content, replyTo });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const setQueriesDataParentComment = ({ parentCommentId }: { parentCommentId: UUID }) => {
    const queryFilter: QueryFilters<
      InfiniteData<IApiPaginationResponseWrapper<ICommentDataType>['data']>
    > = {
      queryKey: ['comments'],
    };

    queryClient.setQueriesData(queryFilter, (oldData) => {
      if (!oldData) return;
      return {
        pageParams: oldData.pageParams,
        pages: oldData.pages.map((page) => {
          const hasParentComment = page.items.some((comment) => comment.id === parentCommentId);
          if (hasParentComment) {
            return {
              ...page,
              items: page.items.map((comment) =>
                comment.id === parentCommentId
                  ? { ...comment, repliesCount: comment.repliesCount + 1 } // Increase replies count
                  : comment,
              ),
            };
          }
          return page;
        }),
      };
    });
  };

  const setQueriesDataAddCommentToCommentList = async ({
    commentData,
    variables: { postId, replyTo },
  }: {
    commentData: ICommentDataType;
    variables: {
      postId: UUID;
      content: string;
      replyTo?: UUID;
    };
  }) => {
    const queryFilter: QueryFilters<
      InfiniteData<IApiPaginationResponseWrapper<ICommentDataType>['data']>
    > = {
      queryKey: getCommentsQueryKey({ postId, replyTo }),
    };

    // Cancel the previous query
    await queryClient.cancelQueries(queryFilter);

    // Add new comment to the bottom of the list
    queryClient.setQueriesData(queryFilter, (oldData) => {
      if (!oldData)
        return {
          pageParams: [0],
          pages: [
            {
              items: [commentData],
              totalCount: 1,
              totalPage: 1,
              currentPage: 1,
              pageSize: 1,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          ],
        };
      const lastPage = oldData.pages[oldData.pages.length - 1];
      return {
        pageParams: oldData.pageParams,
        pages: [
          ...oldData.pages.slice(0, -1),
          { ...lastPage, items: [...lastPage.items, commentData] },
        ],
      };
    });
  };

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment, variables) => {
      // const queryFilter: QueryFilters<
      //   InfiniteData<IApiPaginationResponseWrapper<ICommentDataType>['data']>
      // > = {
      //   queryKey: getCommentsQueryKey({ postId: variables.postId, replyTo: variables.replyTo }),
      // };

      const currentCommentList = queryClient.getQueryData(
        getCommentsQueryKey({ postId: variables.postId, replyTo: variables.replyTo }),
      );

      // Increase replies count of parent comment
      if (newComment.replyToId) {
        setQueriesDataParentComment({ parentCommentId: newComment.replyToId });
        if (!isShowReplies && !currentCommentList) {
          queryClient.invalidateQueries({
            queryKey: getCommentsQueryKey({
              postId: variables.postId,
              replyTo: newComment.replyToId,
            }),
          });
        } else {
          setQueriesDataAddCommentToCommentList({
            commentData: newComment,
            variables,
          });
        }
      } else {
        setQueriesDataAddCommentToCommentList({
          commentData: newComment,
          variables,
        });
      }
    },
  });
  return mutation;
}
