'use no memo';

import { EditorContent, useEditor } from '@tiptap/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import HotButton from '@/components/HotButton';
import GeneratePostDialog from '@/components/Posts/Editor/Features/GeneratePostDialog';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { Navigate } from 'react-router-dom';
import UserAvatar from '@/components/UserAvatar';
import { getPostEditorExtensions } from '@/components/Posts/Editor/Extensions/editorExtensions';
import { sanitizeHtml } from '@/utils/sanitizeHtml';

export default function UpdatePostEditor({
  content,
  onChangeContent,
  isPrivate,
  onChangeIsPrivate,
}: {
  isPrivate: boolean;
  content: string;
  onChangeContent: React.Dispatch<React.SetStateAction<string>>;
  onChangeIsPrivate: (isPrivate: boolean) => void;
}) {
  const [isShowGeneratePostDialog, setIsShowGeneratePostDialog] = useState(false);
  const { user } = useAppSelector(selectAuth);

  const editor = useEditor({
    extensions: [...getPostEditorExtensions()],
    content: content,
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      const html = text ? editor.getHTML() : '';
      onChangeContent(text ? sanitizeHtml(html) : '');
    },
  });

  if (!user) return <Navigate to='/' replace />;

  return (
    <div className='w-full max-w-full space-y-5 overflow-x-hidden rounded-md shadow-sm'>
      <div className='flex items-center gap-x-4'>
        <UserAvatar
          avatarUrl={user.avatar}
          fallbackName={user.fullName}
          className='hidden sm:block'
        />
        <div className=''>
          <h3 className='font-semibold'>{user.fullName}</h3>
          <p className='text-sm text-muted-foreground'>@{user.username}</p>
        </div>
      </div>

      <div className='w-full min-h-[8rem] max-h-[20rem] overflow-y-auto bg-card lg:rounded-xl rounded-lg px-5 py-3  max-w-full border-border border space-y-2'>
        {/* {editor && <MenuBar editor={editor} />} */}
        <EditorContent editor={editor} className='' />
      </div>

      {/* Features */}

      <Separator />
      <div className='space-y-4'>
        <h4 className='text-sm text-center'>Add to your post</h4>
        <div className='flex flex-wrap gap-5'>
          <HotButton variant='outline' onClick={() => setIsShowGeneratePostDialog(true)}>
            Generate Post (AI)
          </HotButton>
          <HotButton variant='outline'>Generate Image (AI)</HotButton>
          <Button variant='outline'>Feelings</Button>
        </div>
      </div>

      <div className='flex justify-end gap-2'>
        <Select
          value={isPrivate ? '1' : '0'}
          onValueChange={(value) => {
            onChangeIsPrivate(!!value);
            return value;
          }}
        >
          <SelectTrigger className='w-[100px]'>
            <SelectValue placeholder='Public' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='0'>Public</SelectItem>
            <SelectItem value='1'>Private</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Generate Post Dialog */}
      <GeneratePostDialog
        createPostEditor={editor}
        isOpen={isShowGeneratePostDialog}
        onClose={() => setIsShowGeneratePostDialog(false)}
        onChangeContent={onChangeContent}
      />
    </div>
  );
}
