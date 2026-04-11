import { getPostAPI } from '@/apis/postApi';
import { useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';

export const getPostQueryKey = ({ postId }: { postId: UUID }) => ['post-detail', 'post', postId];

export function useGetPost({ postId, likeUserId }: { postId: UUID; likeUserId?: UUID }) {
  const getPost = async () => {
    const { data } = await getPostAPI({ postId, likeUserId });
    return data;
  };

  const query = useQuery({
    queryKey: getPostQueryKey({ postId }),
    queryFn: getPost,
    retry: false,
  });

  return query;
}
