'use no memo';

import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

export default function CommentEditor({
  content,
  onChangeContent,
}: {
  content: string;
  onChangeContent: (content: string) => void;
}) {
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
        placeholder: 'What are you thinking?',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      onChangeContent(text ? editor.getHTML() : '');
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className='w-full'>
      <div className='w-full min-h-[3rem] max-h-[10rem] overflow-y-auto bg-card lg:rounded-xl rounded-lg px-5 py-3  max-w-full border-border border space-y-2'>
        {/* {editor && <MenuBar editor={editor} />} */}
        <EditorContent editor={editor} className='' />
      </div>
    </div>
  );
}
