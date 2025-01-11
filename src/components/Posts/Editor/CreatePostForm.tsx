import LoadingButton from '@/components/LoadingButton';
import { useSubmitPostMutaion } from '@/components/Posts/Editor/mutations';
import PostEditor from '@/components/Posts/Editor/PostEditor';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function CreatePostForm({ onCloseDialog }: { onCloseDialog: () => void }) {
  const [editorContent, setEditorContent] = useState('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const { mutate, isPending } = useSubmitPostMutaion();

  const onSubmit = () => {
    mutate(
      {
        content: editorContent,
        isPrivate,
      },
      {
        onSuccess: () => {
          setEditorContent('');
          toast({
            title: 'Post submitted!',
            description: 'Your post has been successfully posted.',
            duration: 3000,
          });
          onCloseDialog();
        },
      },
    );
  };

  return (
    <div className='space-y-4 overflow-x-hidden'>
      <PostEditor
        isPrivate={isPrivate}
        content={editorContent}
        onChangeContent={setEditorContent}
        onChangeIsPrivate={setIsPrivate}
      />
      <LoadingButton
        loading={isPending}
        onClick={onSubmit}
        disabled={!editorContent}
        className='w-full'
      >
        Post
      </LoadingButton>
    </div>
  );
}
