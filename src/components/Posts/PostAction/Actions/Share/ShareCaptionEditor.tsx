'use no memo';

import { CustomMention } from '@/components/Posts/Editor/Extensions/CustomMention';
import { getBaseExtensions } from '@/components/Posts/Editor/Extensions/editorExtensions';
import EditorToolbar from '@/components/Posts/Editor/EditorToolbar';
import EmojiPickerButton from '@/components/Posts/Editor/Features/EmojiPickerButton';
import '@/components/Posts/Editor/style.css';
import { sanitizeHtml } from '@/utils/sanitizeHtml';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

/**
 * Lightweight TipTap caption editor for the share dialog.
 *
 * Reuses the same base extensions + `CustomMention` as the post editor so
 * mentions (@username) and hashtags render identically, but drops the heavy
 * post-only features (media upload, AI generation, privacy select).
 */
export default function ShareCaptionEditor({
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
      ...getBaseExtensions(),
      Placeholder.configure({
        placeholder: 'Say something about this... @Mention #Hashtag',
      }),
      CustomMention,
    ],
    content,
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      const html = text ? editor.getHTML() : '';
      onChangeContent(text ? sanitizeHtml(html) : '');
    },
  });

  // Notify parent when the editor instance is ready (for mention tracking).
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  return (
    <div className='px-3 py-2 space-y-2 w-full rounded-lg border border-border bg-card'>
      {editor && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} className='min-h-[60px] max-h-[180px] overflow-y-auto' />
      <div className='flex justify-end'>
        <EmojiPickerButton editor={editor} />
      </div>
    </div>
  );
}
