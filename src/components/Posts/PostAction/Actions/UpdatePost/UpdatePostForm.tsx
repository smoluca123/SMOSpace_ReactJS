import LoadingButton from '@/components/LoadingButton';
import { PostEditor } from '@/components/Posts/Editor';
import { useUpdatePostMutation } from '@/components/Posts/PostAction/Actions/mutations';
import { toast } from '@/hooks/use-toast';
import { usePostContext } from '@/hooks/usePostContext';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useState } from 'react';

export default function UpdatePostForm({ onCloseDialog }: { onCloseDialog: () => void }) {
  const { post } = usePostContext();
  const [editorContent, setEditorContent] = useState(post.content);
  const [isPrivate, setIsPrivate] = useState<boolean>(post.isPrivate);
  const { user } = useAppSelector(selectAuth);
  const { mutate, isPending } = useUpdatePostMutation();

  const onSubmit = () => {
    mutate(
      {
        postId: post.id,
        content: editorContent,
        isPrivate,
      },
      {
        onSuccess: () => {
          setEditorContent('');
          toast({
            title: 'Post updated!',
            description: 'Your post has been successfully updated.',
            duration: 3000,
          });
          onCloseDialog();
        },
      },
    );
  };

  if (!user) return null;
  return (
    <div className='overflow-x-hidden space-y-4'>
      <PostEditor
        content={editorContent}
        onChangeContent={setEditorContent}
        isPrivate={isPrivate}
        onChangeIsPrivate={setIsPrivate}
      />
      <LoadingButton
        loading={isPending}
        onClick={onSubmit}
        disabled={!editorContent}
        className='min-w-full'
      >
        Update
      </LoadingButton>
    </div>
  );
}
