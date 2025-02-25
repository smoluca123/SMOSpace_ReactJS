import { PostContext } from '@/contexts/PostContext';
import { IPostDataWithLikedStatusType } from '@/lib/types/interfaces';
import { useState } from 'react';

export function PostProvider({
  children,
  post,
}: {
  children: React.ReactNode;
  post: IPostDataWithLikedStatusType;
}) {
  const [displayCommentBox, setDisplayCommentBox] = useState(false);
  return (
    <PostContext.Provider value={{ post, displayCommentBox, setDisplayCommentBox }}>
      {children}
    </PostContext.Provider>
  );
}
