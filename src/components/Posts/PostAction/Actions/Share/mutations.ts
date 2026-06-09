import { sharePostAPI } from '@/apis/postApi';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import {
  IApiPaginationResponseWrapper,
  IPostDataWithLikedStatusType,
} from '@/lib/types/interfaces';
import { getPostQueryKey } from '@/modules/post-detail/components/PostDetail/querys';
import { InfiniteData, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

/**
 * Share (repost) a post.
 *
 * On success we:
 *  1. Prepend the freshly created share post to the top of every `posts`
 *     infinite feed (same approach as `useSubmitPostMutation`).
 *  2. Bump the original post's `shareCount` everywhere it is cached (feeds +
 *     the post-detail view) so the counter updates without a refetch.
 */
export function useSharePostMutation() {
  const queryClient = useQueryClient();
  const { update: updateUserInfomation } = useUpdateDataInfomation();

  const share = async ({
    postId,
    content,
    isPrivate,
    mentionedUserIds,
  }: {
    postId: UUID;
    content?: string;
    isPrivate?: boolean;
    mentionedUserIds?: string[];
  }) => {
    try {
      const { data } = await sharePostAPI({ postId, content, isPrivate, mentionedUserIds });
      return data;
    } catch (error) {
      console.error('Failed to share post:', error);
      throw error instanceof Error ? error : new Error('Failed to share post');
    }
  };

  const mutation = useMutation({
    mutationKey: ['sharePost'],
    mutationFn: share,
    onSuccess: (newPost) => {
      const postsQueryFilter = { queryKey: ['posts'] };

      // The id of the original post whose shareCount should be bumped.
      const originalId = newPost.sharedPost?.id ?? newPost.sharedPostId ?? undefined;

      // 1) Prepend the new share post to the first page of every feed.
      if (!newPost.isPrivate) {
        queryClient.setQueriesData<
          InfiniteData<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data']>
        >(postsQueryFilter, (oldData) => {
          if (!oldData || oldData.pages.length === 0) return oldData;
          const firstPage = oldData.pages[0];
          const updatedFirstPage = {
            ...firstPage,
            items: [{ ...newPost, isLiked: false }, ...firstPage.items],
          };
          return {
            pageParams: oldData.pageParams,
            pages: [updatedFirstPage, ...oldData.pages.slice(1)],
          };
        });
      }

      // 2) Bump the original post's shareCount across feeds.
      if (originalId) {
        queryClient.setQueriesData<
          InfiniteData<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data']>
        >(postsQueryFilter, (oldData) => {
          if (!oldData) return oldData;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((p) =>
                p.id === originalId ? { ...p, shareCount: (p.shareCount ?? 0) + 1 } : p,
              ),
            })),
          };
        });

        // And in the post-detail cache (if open).
        const detailKey = getPostQueryKey({ postId: originalId as UUID }) as QueryKey;
        queryClient.setQueryData<IPostDataWithLikedStatusType>(detailKey, (oldData) =>
          oldData ? { ...oldData, shareCount: (oldData.shareCount ?? 0) + 1 } : oldData,
        );
      }

      // Keep the sharer's post count fresh.
      updateUserInfomation({ data: newPost.author });
    },
  });
  return mutation;
}
