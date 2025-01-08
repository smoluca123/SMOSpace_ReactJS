import { PostContext } from '@/contexts/PostContext';
import { IPostDataWithLikedStatusType } from '@/lib/types/interfaces';

export function PostProvider({
  children,
  post,
}: {
  children: React.ReactNode;
  post: IPostDataWithLikedStatusType;
}) {
  return <PostContext.Provider value={{ post }}>{children}</PostContext.Provider>;
}
