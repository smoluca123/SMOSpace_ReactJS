import { deletePostAPI, likePostAPI, updatePostAPI } from '@/apis/postApi';
import { UUID } from 'crypto';
import {
  InfiniteData,
  QueryFilters,
  QueryKey,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  IApiPaginationResponseWrapper,
  IPostDataWithLikedStatusType,
  IPostLikeType,
} from '@/lib/types/interfaces';
import { getLikedUsersQueryKey } from '@/components/Posts/PostEngagementMetrics/LikedUsersDialog/querys';

export function useLikePostMutation() {
  const queryClient = useQueryClient();

  const likePost = async ({ postId }: { postId: UUID }) => {
    try {
      const { data } = await likePostAPI({ postId });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationKey: ['likePost'],
    mutationFn: likePost,
    onSuccess: async (newData) => {
      const postsQueryFilter: QueryFilters<
        InfiniteData<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data']>
      > = {
        queryKey: ['posts'],
      };

      const likedUsersQueryFilter: QueryFilters<
        InfiniteData<IApiPaginationResponseWrapper<IPostLikeType>['data']>
      > = {
        queryKey: getLikedUsersQueryKey(newData.id),
      };

      // Cancel the existing posts query to prevent race condition
      await queryClient.cancelQueries(postsQueryFilter);

      // Cancel the existing liked users query to prevent race condition
      // await queryClient.cancelQueries(likedUsersQueryFilter);

      await queryClient.invalidateQueries(likedUsersQueryFilter);

      // Update the post data in the query cache
      queryClient.setQueriesData(postsQueryFilter, (oldData) => {
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

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  const deletePost = async ({ postId }: { postId: UUID }) => {
    try {
      const { data } = await deletePostAPI({ postId });
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
      const queryFilter: QueryFilters<
        InfiniteData<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data']>
      > = {
        queryKey: ['posts'],
      };
      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData(queryFilter, (oldData) => {
        if (!oldData) return oldData;
        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => {
            const hasPost = page.items.some((post) => post.id === newData.id);

            if (!hasPost) return page;

            return {
              ...page,
              items: page.items.map((post) =>
                post.id === newData.id ? { ...newData, isLiked: false } : post,
              ),
            };
          }),
        };
      });
    },
  });
  return mutation;
}
