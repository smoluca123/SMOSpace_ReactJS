import { IPostDataWithLikedStatusType } from '@/lib/types/interfaces';
import { createContext, Dispatch, SetStateAction } from 'react';

interface IPostContext {
  post: IPostDataWithLikedStatusType;
  displayCommentBox: boolean;
  setDisplayCommentBox: Dispatch<SetStateAction<boolean>>;
  isRedirectWhenDelete: boolean;
  setIsRedirectWhenDelete: Dispatch<SetStateAction<boolean>>;
}

export const PostContext = createContext<IPostContext | null>(null);
