import { handleNewComment } from '@/components/Posts/Comment/CommentActions/CreateComment/utils';
import { commentSocket } from '@/lib/sockets';
import { ICommentDataType } from '@/lib/types/interfaces';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useEffect, useRef } from 'react';

interface UseCommentSocketProps {
  postId: UUID;
  isSubscribed: boolean;
  onNewComment?: (comment: ICommentDataType) => void;
}

export default function useCommentSocket({
  postId,
  isSubscribed,
  onNewComment,
}: UseCommentSocketProps) {
  const hasSubscribed = useRef<boolean>(false);
  const { user } = useAppSelector(selectAuth);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isSubscribed) return;

    commentSocket.connect();

    const handleConnect = () => {
      if (hasSubscribed.current) return;

      commentSocket.emit('comment:subscribeOnNewComment', { postId });
      commentSocket.on('comment:onNewComment', handleHasNewComment);
      hasSubscribed.current = true;
    };

    const handleHasNewComment = (newComment: ICommentDataType) => {
      if (newComment.author.id === user?.id) return;

      if (onNewComment) {
        onNewComment(newComment);
      }

      handleNewComment({
        newComment,
        variables: {
          postId,
          content: newComment.content,
          replyTo: newComment.replyToId || undefined,
        },
        isShowReplies: false,
        queryClient,
      });
    };

    commentSocket.on('connect', handleConnect);

    // Nếu socket đã connected sẵn thì emit luôn
    if (commentSocket.connected) {
      handleConnect();
    }

    return () => {
      commentSocket.off('comment:onNewComment');
      commentSocket.off('connect');
      commentSocket.disconnect();
    };
  }, [isSubscribed, postId, user?.id, onNewComment, queryClient]);
}
