import Mention from '@tiptap/extension-mention';
import { MentionSuggestion } from './MentionSuggestion';

/**
 * Custom Mention extension with username support
 * Extends default Mention to include username attribute for profile linking
 */
export const CustomMention = Mention.extend({
  name: 'mention',

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }
          return {
            'data-id': attributes.id,
          };
        },
      },
      label: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-label'),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {};
          }
          return {
            'data-label': attributes.label,
          };
        },
      },
      username: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-username'),
        renderHTML: (attributes) => {
          if (!attributes.username) {
            return {};
          }
          return {
            'data-username': attributes.username,
          };
        },
      },
    };
  },
}).configure({
  HTMLAttributes: {
    class: 'mention',
  },
  renderHTML({ options, node }) {
    return [
      'a',
      {
        href: `/profile/${node.attrs.username}`,
        ...options.HTMLAttributes,
      },
      `@${node.attrs.label ?? node.attrs.id}`,
    ];
  },
  renderText({ node }) {
    return `@${node.attrs.label ?? node.attrs.id}`;
  },
  suggestion: {
    ...MentionSuggestion,
    allowSpaces: true,
  },
});
