import { Editor } from '@tiptap/react';
import { useEffect, useState } from 'react';

/**
 * Custom hook to track mentioned user IDs from TipTap editor
 * Extracts user IDs from mention nodes in the editor content
 */
export function useMentionTracking(editor: Editor | null) {
  const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (!editor) return;

    // Function to extract mentioned user IDs from editor content
    const extractMentions = () => {
      const mentions: string[] = [];

      editor.state.doc.descendants((node) => {
        if (node.type.name === 'mention') {
          const userId = node.attrs.id;
          if (userId && !mentions.includes(userId)) {
            mentions.push(userId);
          }
        }
      });

      setMentionedUserIds(mentions);
    };

    // Extract mentions on initial load
    extractMentions();

    // Listen to editor updates and extract mentions when content changes
    const handleUpdate = () => {
      extractMentions();
    };

    editor.on('update', handleUpdate);

    // Cleanup
    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor]);

  return mentionedUserIds;
}
