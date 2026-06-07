import { likeCommentAPI } from '@/apis/postApi';
import { IReactionType } from '@/lib/reactions';
import { IApiPaginationResponseWrapper, ICommentDataType } from '@/lib/types/interfaces';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

/**
 * Toggle/swap a reaction on a comment.
 *
 * Mirrors `useLikePostMutation` but for comments. After the server replies,
 * we walk every `comments` infinite-query cache (root-level + per-thread
 * `replyTo`) and replace the matching item with the fresh server-shaped
 * comment so the UI updates without a refetch.
 *
 * Also invalidates per-comment "likes" lists so the LikedUsers dialog (when
 * opened) reflects the new reaction.
 */
export function useLikeCommentMutation() {
  const queryClient = useQueryClient();

  const reactToComment = async ({ commentId, type }: { commentId: UUID; type?: IReactionType }) => {
    try {
      const { data } = await likeCommentAPI({ commentId, type });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['likeComment'],
    mutationFn: reactToComment,
    onSuccess: async (newData) => {
      const commentsQueryFilter = { queryKey: ['comments'] };

      // Refresh every reaction tab for this comment (All / Like / Love / ...)
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'commentLikes' &&
          (query.queryKey[1] as { commentId?: string } | undefined)?.commentId === newData.id,
      });

      // Cancel in-flight comments queries to prevent races
      await queryClient.cancelQueries(commentsQueryFilter);

      // Walk every infinite-query page and replace the comment by id
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<ICommentDataType>['data']>
      >(commentsQueryFilter, (oldData) => {
        if (!oldData) return oldData;

        const updatedPages = oldData.pages.map((page) => {
          const hasComment = page.items.some((c) => c.id === newData.id);
          if (!hasComment) return page;
          return {
            ...page,
            items: page.items.map((c) => (c.id === newData.id ? { ...c, ...newData } : c)),
          };
        });

        return { pageParams: oldData.pageParams, pages: updatedPages };
      });
    },
  });
  return mutation;
}
