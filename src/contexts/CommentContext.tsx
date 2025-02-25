import { ICommentDataType } from '@/lib/types/interfaces';
import { createContext, Dispatch, SetStateAction } from 'react';

export interface CommentContextType {
  comment: ICommentDataType;
  isShowReplyInput: boolean;
  setIsShowReplyInput: Dispatch<SetStateAction<boolean>>;
  isShowReplies: boolean;
  setIsShowReplies: Dispatch<SetStateAction<boolean>>;
}

export const CommentContext = createContext<CommentContextType | null>(null);
