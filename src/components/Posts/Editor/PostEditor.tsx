'use no memo';

import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import './style.css';
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
import PostMedia from '@/components/Posts/Editor/PostMedia/';
import GeneratePostImagesDialog from '@/components/Posts/Editor/Features/GeneratePostImages';
import axios from 'axios';
import { blobToFile } from '@/lib/utils';
import EditorToolbar from '@/components/Posts/Editor/EditorToolbar';

export default function PostEditor({
  content,
  onChangeContent,
  isPrivate,
  onChangeIsPrivate,
  media,
  onChangeMedia,
}: {
  isPrivate: boolean;
  content: string;
  onChangeContent: React.Dispatch<React.SetStateAction<string>>;
  onChangeIsPrivate: (isPrivate: boolean) => void;
  media?: File[];
  onChangeMedia?: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  const { user } = useAppSelector(selectAuth);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: {
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
        italic: {
          HTMLAttributes: {
            class: 'italic',
          },
        },
        strike: {
          HTMLAttributes: {
            class: 'line-through',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'bg-muted px-1.5 py-0.5 rounded text-sm font-mono',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-primary pl-4 italic',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-inside',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-inside',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'ml-4',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-muted p-4 rounded-lg font-mono text-sm',
          },
        },
        // History is enabled by default in StarterKit for undo/redo
        history: {
          depth: 100,
          newGroupDelay: 500,
        },
      }),
      Placeholder.configure({
        placeholder: "What's going on? #Hashtag... @Mention...",
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      onChangeContent(text ? editor.getHTML() : '');
    },
  });

  if (!user) return <Navigate to='/' replace />;

  return (
    <div className='w-full max-w-full px-1 space-y-5 overflow-x-hidden rounded-md shadow-sm'>
      <div className='flex items-center justify-between'>
        {/* Author Info */}
        <AuthorInfo />

        {/* Privacy Select */}
        <PrivacySelect
          isPrivate={isPrivate}
          onChangeIsPrivate={(value) => {
            onChangeIsPrivate(!!+value);
            return value;
          }}
        />
      </div>

      <div className='w-full min-h-[8rem] max-h-[20rem] overflow-y-auto bg-card lg:rounded-xl rounded-lg px-5 py-3  max-w-full border-border border space-y-2'>
        {editor && <EditorToolbar editor={editor} />}
        <EditorContent editor={editor} className='' />
      </div>

      {/* Post Media */}
      {media && onChangeMedia && <PostMedia media={media} onChangeMedia={onChangeMedia} />}

      <Separator />
      {/* Features */}
      <PostFeatures
        editor={editor}
        onChangeContent={onChangeContent}
        onChangeMedia={onChangeMedia}
      />
    </div>
  );
}

function AuthorInfo() {
  const { user } = useAppSelector(selectAuth);
  if (!user) return null;
  return (
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
  );
}

function PrivacySelect({
  isPrivate,
  onChangeIsPrivate,
}: {
  isPrivate: boolean;
  onChangeIsPrivate: (isPrivate: '1' | '0') => void;
}) {
  return (
    <Select value={isPrivate ? '1' : '0'} onValueChange={onChangeIsPrivate}>
      <SelectTrigger className='w-[100px]'>
        <SelectValue placeholder='Public' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='0'>Public</SelectItem>
        <SelectItem value='1'>Private</SelectItem>
      </SelectContent>
    </Select>
  );
}

function PostFeatures({
  editor,
  onChangeContent,
  onChangeMedia,
}: {
  editor: Editor | null;
  onChangeContent: React.Dispatch<React.SetStateAction<string>>;
  onChangeMedia?: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  const [isShowGeneratePostDialog, setIsShowGeneratePostDialog] = useState(false);
  const [isShowGeneratePostImagesDialog, setIsShowGeneratePostImagesDialog] = useState(false);

  async function handleAddImages(urls: string[]) {
    if (onChangeMedia) {
      const files = await Promise.all(
        urls.map(async (url, idx) => {
          const { data } = await axios.get<Blob>(url, {
            responseType: 'blob',
          });

          const ext = url.split('.').pop()?.split('?')[0] || 'jpg';
          const file = blobToFile(data, `ai-image-${Date.now()}-${idx}.${ext}`);
          return file;
        }),
      );
      console.log(files);
      onChangeMedia((prev) => [...(prev || []), ...files]);
    }
  }

  return (
    <>
      <div className='space-y-4'>
        <h4 className='text-sm text-center'>Add to your post</h4>
        <div className='flex flex-wrap gap-5'>
          <HotButton variant='outline-primary' onClick={() => setIsShowGeneratePostDialog(true)}>
            Generate Post (AI)
          </HotButton>
          <HotButton
            variant='outline-primary'
            onClick={() => setIsShowGeneratePostImagesDialog(true)}
          >
            Generate Image (AI)
          </HotButton>
          <Button variant='outline-primary'>Feelings</Button>
        </div>
      </div>
      {/* Generate Post Dialog */}
      <GeneratePostDialog
        createPostEditor={editor}
        isOpen={isShowGeneratePostDialog}
        onClose={() => setIsShowGeneratePostDialog(false)}
        onChangeContent={onChangeContent}
      />
      <GeneratePostImagesDialog
        isOpen={isShowGeneratePostImagesDialog}
        onClose={() => setIsShowGeneratePostImagesDialog(false)}
        onAddImages={handleAddImages}
      />
    </>
  );
}
