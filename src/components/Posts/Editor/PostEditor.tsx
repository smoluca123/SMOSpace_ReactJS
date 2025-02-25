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
//     <div className='w-full max-w-full space-y-5 overflow-x-hidden rounded-md shadow-sm'>
//       <div className='flex items-center gap-x-4'>
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

//       <div className='flex justify-end gap-2'>
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

import { EditorContent, useEditor } from '@tiptap/react';
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

export default function PostEditor({
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
    <div className='w-full max-w-full px-1 space-y-5 overflow-x-hidden rounded-md shadow-sm'>
      <div className='flex items-center justify-between'>
        {/* Author Info */}
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

        {/* Privacy Select */}
        <Select
          value={isPrivate ? '1' : '0'}
          onValueChange={(value) => {
            onChangeIsPrivate(!!+value);
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

      <div className='w-full min-h-[8rem] max-h-[20rem] overflow-y-auto bg-card lg:rounded-xl rounded-lg px-5 py-3  max-w-full border-border border space-y-2'>
        {/* {editor && <MenuBar editor={editor} />} */}
        <EditorContent editor={editor} className='' />
      </div>

      {/* Features */}

      <Separator />
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
    </div>
  );
}
