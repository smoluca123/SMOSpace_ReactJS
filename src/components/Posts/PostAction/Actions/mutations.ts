import { adminDeletePostAPI, deletePostAPI, likePostAPI, updatePostAPI } from '@/apis/postApi';
import { toggleBookmarkAPI } from '@/apis/postApi';
import { UUID } from 'crypto';
import { InfiniteData, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  IApiPaginationResponseWrapper,
  IPostDataWithLikedStatusType,
} from '@/lib/types/interfaces';
import { IReactionType } from '@/lib/reactions';
import { getPostQueryKey } from '@/modules/post-detail/components/PostDetail/querys';
import { getMyBookmarksQueryKey } from '@/modules/bookmarks/querys';
import useUpdateDataInfomation from '@/hooks/useUpdateDataInfomation';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

export function useLikePostMutation() {
  const queryClient = useQueryClient();

  const reactToPost = async ({ postId, type }: { postId: UUID; type?: IReactionType }) => {
    try {
      const { data } = await likePostAPI({ postId, type });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['likePost'],
    mutationFn: reactToPost,
    onSuccess: async (newData) => {
      const postsQueryFilter = {
        queryKey: ['posts'],
      };
      const postQueryFilter = {
        queryKey: getPostQueryKey({ postId: newData.id }),
      };

      const postQueryData = queryClient.getQueryData<IPostDataWithLikedStatusType>(
        postQueryFilter.queryKey as QueryKey,
      );

      // Invalidate every reaction tab for this post (All / Like / Love / ...),
      // not just one type, so the lists refresh after a reaction change.
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'likes' &&
          (query.queryKey[1] as { postId?: string } | undefined)?.postId === newData.id,
      });

      if (postQueryData) {
        queryClient.setQueryData<IPostDataWithLikedStatusType>(
          postQueryFilter.queryKey as QueryKey,
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              ...newData,
            };
          },
        );
      }

      // Cancel the existing posts query to prevent race condition
      await queryClient.cancelQueries(postsQueryFilter);
      // Update the post data in the query cache
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data']>
      >(postsQueryFilter, (oldData) => {
        if (!oldData) return oldData;

        const updatedPages = oldData.pages.map((page) => {
          // Check if current page contains the post that needs updating
          const hasPost = page.items.some((post) => post.id === newData.id);

          // Only map through items if the page contains the target post
          if (!hasPost) return page;

          return {
            ...page,
            items: page.items.map((post) => (post.id === newData.id ? newData : post)),
          };
        });

        return {
          pageParams: oldData.pageParams,
          pages: updatedPages,
        };
      });
    },
  });
  return mutation;
}

export function useToggleBookmarkMutation() {
  const queryClient = useQueryClient();

  const toggleBookmark = async ({ postId }: { postId: UUID }) => {
    try {
      const { data } = await toggleBookmarkAPI({ postId });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  return useMutation({
    mutationKey: ['toggleBookmark'],
    mutationFn: toggleBookmark,
    onSuccess: async (newData) => {
      // Sync the post detail cache
      const postQueryKey = getPostQueryKey({ postId: newData.id });
      const postQueryData = queryClient.getQueryData<IPostDataWithLikedStatusType>(postQueryKey);
      if (postQueryData) {
        queryClient.setQueryData<IPostDataWithLikedStatusType>(postQueryKey, (oldData) =>
          oldData ? { ...oldData, ...newData } : oldData,
        );
      }

      // Sync the bookmark flag across all feed caches
      const postsQueryFilter = { queryKey: ['posts'] as QueryKey };
      await queryClient.cancelQueries(postsQueryFilter);
      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data']>
      >(postsQueryFilter, (oldData) => {
        if (!oldData) return oldData;
        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((post) =>
              post.id === newData.id ? { ...post, isBookmarked: newData.isBookmarked } : post,
            ),
          })),
        };
      });

      // Refresh the bookmarks list so saved/unsaved posts appear/disappear
      queryClient.invalidateQueries({ queryKey: getMyBookmarksQueryKey() });
    },
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();
  const { isAdmin, user } = useAppSelector(selectAuth);
  const { update: updateUserInfomation } = useUpdateDataInfomation();

  const deletePost = async ({ postId }: { postId: UUID }) => {
    try {
      const { data } = await (isAdmin ? adminDeletePostAPI : deletePostAPI)({ postId });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['deletePost'],
    mutationFn: deletePost,
    onSuccess: async (newData) => {
      const postsQueryKey: QueryKey = ['posts'];
      await queryClient.cancelQueries({ queryKey: postsQueryKey });

      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data']>
      >({ queryKey: postsQueryKey }, (oldData) => {
        if (!oldData) return oldData;
        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.filter((post) => post.id !== newData.id),
          })),
        };
      });
      // update the user data in the query cache
      if (user?.id === newData.author.id) {
        updateUserInfomation({ data: newData.author });
      }
    },
  });
  return mutation;
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();

  const updatePost = async ({
    postId,
    content,
    isPrivate,
  }: {
    postId: UUID;
    content: string;
    isPrivate: boolean;
  }) => {
    try {
      const { data } = await updatePostAPI({ postId, content, isPrivate });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };
  const mutation = useMutation({
    mutationKey: ['updatePost'],
    mutationFn: updatePost,
    onSuccess: async (newData) => {
      const queryFilter = {
        queryKey: ['posts'],
      };
      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<
        InfiniteData<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data']>
      >(queryFilter, (oldData) => {
        if (!oldData) return oldData;
        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => {
            const hasPost = page.items.some((post) => post.id === newData.id);

            if (!hasPost) return page;

            return {
              ...page,
              items: page.items.map((post) =>
                post.id === newData.id ? { ...post, ...newData } : post,
              ),
            };
          }),
        };
      });
    },
  });
  return mutation;
}
