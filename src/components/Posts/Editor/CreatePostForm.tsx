import LoadingButton from '@/components/LoadingButton';
import { useSubmitPostMutaion } from '@/components/Posts/Editor/mutations';
import PostEditor from '@/components/Posts/Editor/PostEditor';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function CreatePostForm({ onCloseDialog }: { onCloseDialog: () => void }) {
  const [editorContent, setEditorContent] = useState('');
  const [media, setMedia] = useState<File[]>([]);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const { mutate, isPending } = useSubmitPostMutaion();

  const onSubmit = () => {
    mutate(
      {
        content: editorContent,
        isPrivate,
        images: media,
      },
      {
        onSuccess: () => {
          setEditorContent('');
          setMedia([]);
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
    <div className='overflow-x-hidden space-y-4'>
      <PostEditor
        isPrivate={isPrivate}
        content={editorContent}
        onChangeContent={setEditorContent}
        onChangeIsPrivate={setIsPrivate}
        onChangeMedia={setMedia}
        media={media}
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
