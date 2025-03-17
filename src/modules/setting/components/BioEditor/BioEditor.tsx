import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

export default function BioEditor({
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
        placeholder: 'How about you ?',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChangeContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className='w-full'>
      <div className='w-full min-h-[3rem] max-h-[10rem] overflow-y-auto lg:rounded-xl rounded-lg px-5 py-3  max-w-full border-border border space-y-2 hover:border-primary'>
        <EditorContent editor={editor} className='' />
      </div>
    </div>
  );
}
