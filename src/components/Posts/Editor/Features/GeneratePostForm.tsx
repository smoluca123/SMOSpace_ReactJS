import { useGeneratePostMutaion } from '@/components/Posts/Editor/Features/mutations';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Editor } from '@tiptap/react';
import LoadingButton from '@/components/LoadingButton';
import { IGeneratePostResponseType } from '@/lib/types/interfaces';

interface GeneratePostFormProps {
  createPostEditor: Editor | null;
  closeDialog: () => void;
  onChangeContent: React.Dispatch<React.SetStateAction<string>>;
}

const showErrorToast = (message: string) => {
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  });
};

const showSuccessToast = () => {
  toast({
    title: 'Success',
    description: 'Content has been generated successfully',
    duration: 3000,
  });
};

export default function GeneratePostForm({
  createPostEditor,
  closeDialog,
  onChangeContent,
}: GeneratePostFormProps) {
  const [prompt, setPrompt] = useState('');

  const { mutate, isPending } = useGeneratePostMutaion();

  const handleGeneratePost = () => {
    if (!prompt.trim()) {
      showErrorToast('Please enter your prompt');
      return;
    }

    mutate(
      { prompt },
      {
        onSuccess: (data: IGeneratePostResponseType) => {
          setPrompt('');
          createPostEditor?.commands.setContent(data.content);
          onChangeContent(data.content);
          showSuccessToast();
          closeDialog();
        },
        onError: (error) => {
          console.log(error);
          showErrorToast(error.message || 'Something went wrong');
        },
      },
    );
  };

  return (
    <div className='w-full md:w-[25rem] space-y-4'>
      <div className='space-y-2'>
        <Label>Write something here..</Label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your post, e.g. 'Write a post about AI technology'"
          className='h-[12rem] overflow-y-auto bg-card'
        />
      </div>
      <LoadingButton
        loading={isPending}
        className='ml-auto'
        onClick={handleGeneratePost}
        disabled={!prompt.trim()}
      >
        Generate
      </LoadingButton>
    </div>
  );
}
