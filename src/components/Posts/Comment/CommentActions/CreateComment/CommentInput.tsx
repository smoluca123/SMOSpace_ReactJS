import LoadingButton from '@/components/LoadingButton';
import { CommentEditor } from '@/components/Posts/Comment/CommentActions/CreateComment/CommentEditor';
import { useSubmitCommentMutation } from '@/components/Posts/Comment/CommentActions/CreateComment/mutations';
import UserAvatar from '@/components/UserAvatar';
import { toast } from '@/hooks/use-toast';
import { usePostContext } from '@/hooks/usePostContext';
import { commentSchema } from '@/lib/validations';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { UUID } from 'crypto';
import { SendIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

export default function CommentInput({
  replyToCommentId,
  isShowReplies,
  setIsShowReplyInput,
  setIsShowReplies,
}: {
  replyToCommentId?: UUID;
  isShowReplies?: boolean;
  setIsShowReplyInput?: Dispatch<SetStateAction<boolean>>;
  setIsShowReplies?: Dispatch<SetStateAction<boolean>>;
}) {
  const { post } = usePostContext();
  const { user } = useAppSelector(selectAuth);
  const [content, setContent] = useState('');

  const {
    mutation: { mutate: submitComment, isPending },
  } = useSubmitCommentMutation({ isShowReplies });

  const handleSubmit = () => {
    const values = commentSchema.parse({ content });
    submitComment(
      { postId: post.id, content: values.content, replyTo: replyToCommentId },
      {
        onSuccess: () => {
          setContent('');
          if (setIsShowReplyInput) setIsShowReplyInput(false);
          if (setIsShowReplies) setIsShowReplies(true);
          toast({
            title: 'Successfully',
            description: 'Your comment has been submitted',
            duration: 3000,
          });
        },
      },
    );
  };

  if (!user) return null;
  return (
    <div>
      <div className='flex gap-2 items-center'>
        <UserAvatar avatarUrl={user.avatar} fallbackName={user.fullName} />
        <CommentEditor content={content} onChangeContent={setContent} />
        <LoadingButton
          className='h-[2.8rem]'
          onClick={handleSubmit}
          loading={isPending}
          disabled={!content}
        >
          {!isPending && <SendIcon className='text-white' />}
        </LoadingButton>
      </div>
    </div>
  );
}
