import { getCommentsAPI } from '@/apis/postApi';
import { IPaginationParamsType } from '@/lib/types/interfaces';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const getCommentsQueryKey = ({
  postId,
  replyTo,
}: {
  postId: UUID;
  replyTo?: UUID;
}): QueryKey => ['comments', { postId, replyTo }];
export const useGetComments = ({
  postId,
  replyTo,
  enabled = true,
}: {
  postId: UUID;
  replyTo?: UUID;
  enabled?: boolean;
}) => {
  const getComments = async ({ page, limit }: IPaginationParamsType) => {
    try {
      const { data } = await getCommentsAPI({
        postId,
        page,
        limit,
        replyTo,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const query = useInfiniteQuery({
    queryKey: getCommentsQueryKey({ postId, replyTo }),
    queryFn: async ({ pageParam = 1 }) => getComments({ page: pageParam }),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined),
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
  return query;
};
