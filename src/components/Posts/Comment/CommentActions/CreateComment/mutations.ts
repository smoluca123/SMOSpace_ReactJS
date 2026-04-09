import { submitCommentAPI } from '@/apis/postApi';
import { handleNewComment } from '@/components/Posts/Comment/CommentActions/CreateComment/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

export function useSubmitCommentMutation({ isShowReplies }: { isShowReplies?: boolean }) {
  const queryClient = useQueryClient();

  const submitComment = async ({
    postId,
    content,
    replyTo,
    mentionedUserIds,
  }: {
    postId: UUID;
    content: string;
    replyTo?: UUID;
    mentionedUserIds?: string[];
  }) => {
    try {
      const { data } = await submitCommentAPI({ postId, content, replyTo, mentionedUserIds });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: (newComment, { postId, content, replyTo }) => {
      handleNewComment({
        newComment,
        variables: { postId, content, replyTo },
        isShowReplies: isShowReplies || false,
        queryClient,
      });
    },
  });

  return { mutation, handleNewComment };
}
