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
  const { user, isAuthenticated } = useAppSelector(selectAuth);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isSubscribed) return;

    // Don't connect if not authenticated
    if (!isAuthenticated || !user?.id) {
      if (commentSocket.connected) {
        commentSocket.disconnect();
      }
      return;
    }

    // Force disconnect and reconnect to ensure fresh token is sent
    if (commentSocket.connected) {
      commentSocket.disconnect();
    }
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

    // Emit immediately if the socket is already connected
    if (commentSocket.connected) {
      handleConnect();
    }

    return () => {
      commentSocket.off('comment:onNewComment');
      commentSocket.off('connect');
      // Keep connection, only reset subscription flag
      hasSubscribed.current = false;
    };
  }, [isAuthenticated, isSubscribed, postId, user?.id, onNewComment, queryClient]);
}
