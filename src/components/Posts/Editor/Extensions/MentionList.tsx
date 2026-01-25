import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/UserAvatar';

export interface MentionListProps {
  items: Array<{
    id: string;
    username: string;
    fullName: string;
    avatar?: string;
  }>;
  command: (item: { id: string; label: string; username: string }) => void;
}

export interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const MentionList = forwardRef<MentionListRef, MentionListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item.id, label: item.fullName, username: item.username });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  if (props.items.length === 0) {
    return (
      <div className='p-3 text-sm border rounded-lg shadow-lg bg-popover border-border text-muted-foreground'>
        No users found
      </div>
    );
  }

  return (
    <div
      className='mention-list'
      onWheel={(e) => {
        e.stopPropagation(); // Prevent editor from capturing wheel events
      }}
    >
      {props.items.map((item, index) => (
        <button
          // ref={(el) => {
          //   // Auto-scroll selected item into view
          //   if (index === selectedIndex && el) {
          //     el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          //   }
          // }}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 text-left transition-colors',
            'hover:bg-accent focus:bg-accent focus:outline-none',
            index === selectedIndex && 'bg-accent',
          )}
          key={item.id}
          onMouseDown={() => {
            // e.preventDefault();
            selectItem(index);
          }}
          type='button'
        >
          <UserAvatar avatarUrl={item.avatar} fallbackName={item.fullName} className='size-8' />
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium truncate'>{item.fullName}</p>
            <p className='text-xs truncate text-muted-foreground'>@{item.username}</p>
          </div>
        </button>
      ))}
    </div>
  );
});

MentionList.displayName = 'MentionList';
