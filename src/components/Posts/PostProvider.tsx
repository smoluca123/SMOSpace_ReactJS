import { PostContext } from '@/contexts/PostContext';
import { IPostDataWithLikedStatusType } from '@/lib/types/interfaces';
import { useState } from 'react';

export function PostProvider({
  children,
  post,
  isRedirectWhenDeleteInitial = false,
}: {
  children: React.ReactNode;
  post: IPostDataWithLikedStatusType;
  isRedirectWhenDeleteInitial?: boolean;
}) {
  const [displayCommentBox, setDisplayCommentBox] = useState(false);
  const [isRedirectWhenDelete, setIsRedirectWhenDelete] = useState(isRedirectWhenDeleteInitial);
  return (
    <PostContext.Provider
      value={{
        post,
        displayCommentBox,
        setDisplayCommentBox,
        isRedirectWhenDelete,
        setIsRedirectWhenDelete,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
