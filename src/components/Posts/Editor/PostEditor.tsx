// 'use no memo';

// import { EditorContent, useEditor } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Placeholder from '@tiptap/extension-placeholder';
// import Heading from '@tiptap/extension-heading';
// import UserAvatar from '@/components/UserAvatar';
// import './style.css';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import HotButton from '@/components/HotButton';
// import { useSubmitPostMutaion } from '@/components/Posts/Editor/mutations';
// import LoadingButton from '@/components/LoadingButton';
// import { toast } from '@/hooks/use-toast';
// import GeneratePostDialog from '@/components/Posts/Editor/Features/GeneratePostDialog';
// import { useAppSelector } from '@/redux/hooks';
// import { selectAuth } from '@/redux/slices/authSlice';
// import { Navigate } from 'react-router-dom';

// export default function PostEditor({ onCloseDialog }: { onCloseDialog: () => void }) {
//   const [isShowGeneratePostDialog, setIsShowGeneratePostDialog] = useState(false);
//   const [isPrivate, setIsPrivate] = useState<boolean>(false);
//   // const [editorContent, setEditorContent] = useState('');
//   const { user } = useAppSelector(selectAuth);
//   const { mutate, isPending } = useSubmitPostMutaion();

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         bold: {
//           HTMLAttributes: {
//             class: 'font-bold',
//           },
//         },
//         italic: {
//           HTMLAttributes: {
//             class: 'font-italic',
//           },
//         },
//       }),
//       Placeholder.configure({
//         placeholder: "What's going on? #Hashtag... @Mention...",
//       }),
//       Heading.configure({
//         levels: [1, 2, 3, 4, 5, 6],
//         HTMLAttributes: {
//           class: 'text-2xl font-bold',
//         },
//       }),
//     ],
//     onUpdate: ({ editor }) => {
//       console.log(editor.getText());
//       // setEditorContent(editor.getHTML());
//     },
//   });

//   const editorText = editor?.getText()?.trim() || '';

//   if (!user) return <Navigate to='/' replace />;

//   const onSubmit = () => {
//     mutate(
//       {
//         content: editor?.getHTML().trim() || '',
//         isPrivate,
//       },
//       {
//         onSuccess: () => {
//           editor?.commands.clearContent();
//           toast({
//             title: 'Post submitted!',
//             description: 'Your post has been successfully posted.',
//             duration: 3000,
//           });
//           onCloseDialog();
//         },
//       },
//     );
//   };

//   return (
//     <div className='overflow-x-hidden space-y-5 w-full max-w-full rounded-md shadow-sm'>
//       <div className='flex gap-x-4 items-center'>
//         <UserAvatar
//           avatarUrl={user.avatar}
//           fallbackName={user.fullName}
//           className='hidden sm:block'
//         />
//         <div className=''>
//           <h3 className='font-semibold'>{user.fullName}</h3>
//           <p className='text-sm text-muted-foreground'>@{user.username}</p>
//         </div>
//       </div>

//       <div className='w-full min-h-[8rem] max-h-[20rem] overflow-y-auto bg-card lg:rounded-xl rounded-lg px-5 py-3  max-w-full border-border border space-y-2'>
//         {/* {editor && <MenuBar editor={editor} />} */}
//         <EditorContent editor={editor} className='' />
//       </div>

//       {/* Features */}

//       <Separator />
//       <div className='space-y-4'>
//         <h4 className='text-sm text-center'>Add to your post</h4>
//         <div className='flex flex-wrap gap-5'>
//           <HotButton variant='outline' onClick={() => setIsShowGeneratePostDialog(true)}>
//             Generate Post (AI)
//           </HotButton>
//           <HotButton variant='outline'>Generate Image (AI)</HotButton>
//           <Button variant='outline'>Feelings</Button>
//         </div>
//       </div>

//       <div className='flex gap-2 justify-end'>
//         <Select
//           onValueChange={(value) => {
//             setIsPrivate(!!value);
//             return value;
//           }}
//         >
//           <SelectTrigger className='w-[100px]'>
//             <SelectValue placeholder='Public' />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value='0'>Public</SelectItem>
//             <SelectItem value='1'>Private</SelectItem>
//           </SelectContent>
//         </Select>
//         <LoadingButton
//           loading={isPending}
//           onClick={onSubmit}
//           disabled={!editorText}
//           className='min-w-full sm:min-w-20'
//         >
//           Post
//         </LoadingButton>
//       </div>

//       {/* Generate Post Dialog */}
//       <GeneratePostDialog
//         createPostEditor={editor}
//         isOpen={isShowGeneratePostDialog}
//         onClose={() => setIsShowGeneratePostDialog(false)}
//       />
//     </div>
//   );
// }

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
  media: File[];
  onChangeMedia: React.Dispatch<React.SetStateAction<File[]>>;
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
            class: 'font-italic',
          },
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
    <div className='overflow-x-hidden px-1 space-y-5 w-full max-w-full rounded-md shadow-sm'>
      <div className='flex justify-between items-center'>
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
        {/* {editor && <MenuBar editor={editor} />} */}
        <EditorContent editor={editor} className='' />
      </div>

      {/* Post Media */}
      <PostMedia media={media} onChangeMedia={onChangeMedia} />

      <Separator />
      {/* Features */}
      <PostFeatures editor={editor} onChangeContent={onChangeContent} />
    </div>
  );
}

function AuthorInfo() {
  const { user } = useAppSelector(selectAuth);
  if (!user) return null;
  return (
    <div className='flex gap-x-4 items-center'>
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
}: {
  editor: Editor | null;
  onChangeContent: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isShowGeneratePostDialog, setIsShowGeneratePostDialog] = useState(false);
  return (
    <>
      <div className='space-y-4'>
        <h4 className='text-sm text-center'>Add to your post</h4>
        <div className='flex flex-wrap gap-5'>
          <HotButton variant='outline-primary' onClick={() => setIsShowGeneratePostDialog(true)}>
            Generate Post (AI)
          </HotButton>
          <HotButton variant='outline-primary'>Generate Image (AI)</HotButton>
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
    </>
  );
}
