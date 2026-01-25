import { computePosition, flip, shift } from '@floating-ui/dom';
import { ReactRenderer } from '@tiptap/react';
import { MentionList, MentionListRef } from './MentionList';
import { getAllUsersAPI } from '@/apis/userApi';
import { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';

interface MentionItem {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
}

const updatePosition = (
  element: HTMLElement,
  clientRect: (() => DOMRect) | (() => DOMRect | null) | null,
) => {
  if (!clientRect) return;

  const virtualElement = {
    getBoundingClientRect: clientRect,
  } as { getBoundingClientRect: () => DOMRect };

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = 'max-content';
    element.style.position = strategy;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  });
};

export const MentionSuggestion: Omit<SuggestionOptions<MentionItem>, 'editor'> = {
  items: async ({ query }) => {
    try {
      // Fetch users from API with search query
      const response = await getAllUsersAPI({
        keywords: query,
        limit: 10,
        page: 1,
      });

      return (
        response.data.items?.map((user) => ({
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar,
        })) || []
        // Fake data for testing
        // Array.from({ length: 20 }, (_, i) => ({
        //   id: (i + 1).toString(),
        //   username: `user${i + 1}`,
        //   fullName: `Fake User ${i + 1}`,
        //   avatar: `https://i.pravatar.cc/150?u=${i + 1}`,
        // })).filter(
        //   (user) =>
        //     user.username.toLowerCase().includes(query.toLowerCase()) ||
        //     user.fullName.toLowerCase().includes(query.toLowerCase()),
        // )
      );
    } catch (error) {
      console.error('Error fetching mention suggestions:', error);
      return [];
    }
  },

  render: () => {
    let component: ReactRenderer<MentionListRef> | null = null;

    return {
      onStart: (props: SuggestionProps<MentionItem>) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        component.element.style.position = 'absolute';
        component.element.style.zIndex = '9999';

        document.body.appendChild(component.element);

        updatePosition(component.element, props.clientRect);
      },

      onUpdate(props: SuggestionProps<MentionItem>) {
        component?.updateProps(props);

        if (!props.clientRect || !component) {
          return;
        }

        updatePosition(component.element, props.clientRect);
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        if (props.event.key === 'Escape') {
          component?.destroy();
          return true;
        }

        return component?.ref?.onKeyDown(props) ?? false;
      },

      onExit() {
        component?.destroy();
        component = null;
      },
    };
  },
};
