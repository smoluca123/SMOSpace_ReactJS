'use no memo';

import { sanitizeHtml } from '@/utils/sanitizeHtml';
import { getEditorExtensions } from '@/components/Posts/Editor/Extensions/editorExtensions';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import { useEffect } from 'react';

export default function CommentEditor({
  content,
  onChangeContent,
  onEditorReady,
}: {
  content: string;
  onChangeContent: (content: string) => void;
  onEditorReady?: (editor: Editor) => void;
}) {
  const editor = useEditor({
    extensions: [
      ...getEditorExtensions({
        enableMention: true,
        placeholder: 'What are you thinking?',
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

  // Notify parent when editor is ready
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  return (
    <div className='w-full'>
      <div className='w-full min-h-[3rem] max-h-[10rem] overflow-y-auto bg-card lg:rounded-xl rounded-lg px-5 py-3  max-w-full border-border border space-y-2'>
        {/* {editor && <MenuBar editor={editor} />} */}
        <EditorContent editor={editor} className='' />
      </div>
    </div>
  );
}
