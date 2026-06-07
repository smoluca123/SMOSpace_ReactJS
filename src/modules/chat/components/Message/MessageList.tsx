'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { MessageItem } from '@/modules/chat/components/Message/';
import { IChatMessageUI } from '@/apis/types/chat.interfaces';
import MediaLightbox from '@/components/MediaLightbox';

interface MessageListProps {
  messages: IChatMessageUI[];
  isGroup: boolean;
  onRetry?: (message: IChatMessageUI) => void;
  onDismiss?: (message: IChatMessageUI) => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}

export default function MessageList({
  messages,
  isGroup,
  onRetry,
  onDismiss,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef(0);
  const prevCountRef = useRef(0);
  const loadingOlderRef = useRef(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    // Near the top -> load older messages
    if (el.scrollTop < 80 && hasMore && !isLoadingMore && !loadingOlderRef.current) {
      loadingOlderRef.current = true;
      prevScrollHeightRef.current = el.scrollHeight;
      onLoadMore?.();
    }
  };

  // Keep the viewport anchored when prepending older messages, and stick to the
  // bottom when a new message arrives (or on first render).
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const newCount = messages.length;
    const prevCount = prevCountRef.current;

    if (loadingOlderRef.current && newCount > prevCount) {
      const diff = el.scrollHeight - prevScrollHeightRef.current;
      el.scrollTop = el.scrollTop + diff;
      loadingOlderRef.current = false;
    } else if (newCount > prevCount) {
      el.scrollTop = el.scrollHeight;
    }

    prevCountRef.current = newCount;
  }, [messages]);

  return (
    <div ref={containerRef} onScroll={handleScroll} className='overflow-y-auto flex-1 p-4'>
      {isLoadingMore && (
        <div className='flex justify-center py-2'>
          <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
        </div>
      )}

      <div className='space-y-4'>
        {messages.map((message) => (
          <MessageItem
            key={message.tempId || message.id}
            message={message}
            isGroup={isGroup}
            onRetry={onRetry}
            onDismiss={onDismiss}
            onImageClick={setLightboxSrc}
          />
        ))}
      </div>

      {lightboxSrc && (
        <MediaLightbox
          media={[{ type: 'IMAGE', src: lightboxSrc }]}
          open={!!lightboxSrc}
          onClose={() => setLightboxSrc(null)}
        />
      )}
    </div>
  );
}
