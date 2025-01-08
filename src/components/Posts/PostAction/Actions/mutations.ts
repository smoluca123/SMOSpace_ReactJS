import { likePostAPI } from '@/apis/postApi';
import { UUID } from 'crypto';
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  IApiPaginationResponseWrapper,
  IPostDataWithLikedStatusType,
} from '@/lib/types/interfaces';

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
      const queryFilter: QueryFilters<
        InfiniteData<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data']>
      > = {
        queryKey: ['posts'],
      };
      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData(queryFilter, (oldData) => {
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
