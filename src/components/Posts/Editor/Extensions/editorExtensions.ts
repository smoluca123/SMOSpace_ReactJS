import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { CustomMention } from './CustomMention';
import type { Extensions } from '@tiptap/react';

/**
 * Extension configuration options
 */
export interface EditorExtensionOptions {
  /** Enable mention support (@username) */
  enableMention?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Enable hashtag support (future) */
  enableHashtag?: boolean;
  /** Enable link support */
  enableLink?: boolean;
}

/**
 * Base extensions for all editors
 * Includes StarterKit with basic formatting
 */
export const getBaseExtensions = (): Extensions => {
  return [
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
    }),
  ];
};

/**
 * Get configured extensions based on options
 */
export const getEditorExtensions = (options: EditorExtensionOptions = {}): Extensions => {
  const {
    enableMention = false,
    placeholder = 'Start typing...',
    // enableHashtag = false,
    // enableLink = false,
  } = options;

  const extensions: Extensions = [...getBaseExtensions()];

  // Add Placeholder
  extensions.push(
    Placeholder.configure({
      placeholder,
    }),
  );

  // Add Mention if enabled
  if (enableMention) {
    extensions.push(CustomMention);
  }

  // Future: Add Hashtag if enabled
  // if (enableHashtag) {
  //   extensions.push(CustomHashtag);
  // }

  // Future: Add Link if enabled
  // if (enableLink) {
  //   extensions.push(Link);
  // }

  return extensions;
};

/**
 * Preset for Post Editor
 */
export const getPostEditorExtensions = (placeholder?: string): Extensions => {
  return getEditorExtensions({
    enableMention: true,
    placeholder: placeholder ?? 'What are you thinking?',
  });
};

/**
 * Preset for Comment Editor
 */
export const getCommentEditorExtensions = (placeholder?: string): Extensions => {
  return getEditorExtensions({
    enableMention: true,
    placeholder: placeholder ?? 'Write a comment...',
  });
};

/**
 * Preset for Bio Editor (simple, no mentions)
 */
export const getBioEditorExtensions = (placeholder?: string): Extensions => {
  return getEditorExtensions({
    enableMention: false,
    placeholder: placeholder ?? 'Tell us about yourself...',
  });
};
