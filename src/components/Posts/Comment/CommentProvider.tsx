import { CommentContext } from '@/contexts/CommentContext';
import { ICommentDataType } from '@/lib/types/interfaces';
import { PropsWithChildren, useState } from 'react';

interface IProps extends PropsWithChildren {
  comment: ICommentDataType;
}

export default function CommentProvider({ children, comment }: IProps) {
  const [isShowReplyInput, setIsShowReplyInput] = useState(false);
  const [isShowReplies, setIsShowReplies] = useState(false);
  return (
    <CommentContext.Provider
      value={{ comment, isShowReplyInput, setIsShowReplyInput, isShowReplies, setIsShowReplies }}
    >
      {children}
    </CommentContext.Provider>
  );
}
