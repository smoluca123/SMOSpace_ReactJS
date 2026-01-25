import EditorToolbar from '@/components/Posts/Editor/EditorToolbar';
import { getBaseExtensions } from '@/components/Posts/Editor/Extensions/editorExtensions';
import { sanitizeHtml } from '@/utils/sanitizeHtml';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
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
      ...getBaseExtensions(),
      Placeholder.configure({
        placeholder: 'How about you ?',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      const html = text ? editor.getHTML() : '';
      onChangeContent(text ? sanitizeHtml(html) : '');
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
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} className='' />
      </div>
    </div>
  );
}
