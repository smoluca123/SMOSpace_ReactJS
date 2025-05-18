import { getCommentsQueryKey } from '@/components/Posts/Comment/querys';
import { IApiPaginationResponseWrapper, ICommentDataType } from '@/lib/types/interfaces';
import { InfiniteData, QueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

const setQueriesDataParentComment = ({
  parentCommentId,
  queryClient,
}: {
  parentCommentId: UUID;
  queryClient: QueryClient;
}) => {
  const queryFilter = {
    queryKey: ['comments'],
  };

  queryClient.setQueriesData<InfiniteData<IApiPaginationResponseWrapper<ICommentDataType>['data']>>(
    queryFilter,
    (oldData) => {
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
    },
  );
};

const setQueriesDataAddCommentToCommentList = async ({
  commentData,
  variables: { postId, replyTo },
  queryClient,
}: {
  commentData: ICommentDataType;
  variables: {
    postId: UUID;
    content: string;
    replyTo?: UUID;
  };
  queryClient: QueryClient;
}) => {
  const queryFilter = {
    queryKey: getCommentsQueryKey({ postId, replyTo }),
  };

  // Cancel the previous query
  await queryClient.cancelQueries(queryFilter);

  // Add new comment to the bottom of the list
  queryClient.setQueriesData<InfiniteData<IApiPaginationResponseWrapper<ICommentDataType>['data']>>(
    queryFilter,
    (oldData) => {
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
    },
  );
};

const handleNewComment = async ({
  newComment,
  variables,
  isShowReplies,
  queryClient,
}: {
  newComment: ICommentDataType;
  variables: { postId: UUID; content: string; replyTo?: UUID };
  isShowReplies: boolean;
  queryClient: QueryClient;
}) => {
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
    setQueriesDataParentComment({ parentCommentId: newComment.replyToId, queryClient });
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
        queryClient,
      });
    }
  } else {
    setQueriesDataAddCommentToCommentList({
      commentData: newComment,
      variables,
      queryClient,
    });
  }
};

export { handleNewComment };
