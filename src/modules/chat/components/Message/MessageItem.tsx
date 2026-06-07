'use client';

import UserAvatar from '@/components/UserAvatar';
import { formatTime } from '@/lib/utils/chat-utils';
import { IChatMessageUI } from '@/apis/types/chat.interfaces';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { ReadReceiptAvatars } from '@/modules/chat/components/ReadReceiptAvatars';
import { cn } from '@/lib/utils';
import { Loader2, RotateCw, TriangleAlert, X } from 'lucide-react';

interface MessageItemProps {
  message: IChatMessageUI;
  isGroup: boolean;
  onRetry?: (message: IChatMessageUI) => void;
  onDismiss?: (message: IChatMessageUI) => void;
  onImageClick?: (src: string) => void;
}

export default function MessageItem({
  message,
  isGroup,
  onRetry,
  onDismiss,
  onImageClick,
}: MessageItemProps) {
  const { user } = useAppSelector(selectAuth);
  const isSender = message.sender.id === user?.id;
  const isImage = message.type === 'IMAGE';
  const isSending = message.status === 'sending';
  const isFailed = message.status === 'failed';

  return (
    <div
      className={`flex items-start space-x-3 group ${
        isSender ? 'flex-row-reverse space-x-reverse' : ''
      }`}
    >
      <UserAvatar
        avatarUrl={message.sender.avatar}
        fallbackName={message.sender.fullName}
        className='flex-shrink-0 w-8 h-8'
      />

      <div
        className={`flex flex-col max-w-xs sm:max-w-md ${isSender ? 'items-end' : 'items-start'}`}
      >
        {isGroup && !isSender && (
          <span className='px-2 mb-1 text-xs text-muted-foreground'>{message.sender.fullName}</span>
        )}

        {isImage ? (
          <button
            type='button'
            onClick={() => onImageClick?.(message.content)}
            className='block overflow-hidden rounded-2xl cursor-zoom-in'
          >
            <img src={message.content} alt='Image' className='object-cover max-w-full max-h-64' />
          </button>
        ) : (
          <div
            className={cn(
              'rounded-2xl px-4 py-2',
              isSender ? 'bg-primary text-primary-foreground' : 'bg-muted',
              isSending && 'opacity-70',
              isFailed && 'bg-destructive/15 text-foreground border border-destructive/40',
            )}
          >
            <p className='text-sm leading-relaxed whitespace-pre-wrap break-words'>
              {message.content}
            </p>
          </div>
        )}

        {/* Read receipts for delivered own messages */}
        {!isSending && !isFailed && (
          <ReadReceiptAvatars message={message} currentUserId={user?.id} />
        )}

        {/* Status line */}
        <div className='flex items-center mt-1 space-x-2'>
          {isSending ? (
            <span className='flex items-center gap-1 text-xs text-muted-foreground'>
              <Loader2 className='w-3 h-3 animate-spin' /> Sending...
            </span>
          ) : isFailed ? (
            <span className='flex items-center gap-1 text-xs text-destructive'>
              <TriangleAlert className='w-3 h-3' /> Failed to send
              {onRetry && (
                <button
                  onClick={() => onRetry(message)}
                  className='inline-flex items-center gap-0.5 ml-1 underline hover:opacity-80'
                >
                  <RotateCw className='w-3 h-3' /> Retry
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={() => onDismiss(message)}
                  className='inline-flex items-center ml-1 hover:opacity-80'
                  title='Dismiss'
                >
                  <X className='w-3 h-3' />
                </button>
              )}
            </span>
          ) : (
            <span className='text-xs text-muted-foreground'>
              {formatTime(new Date(message.createdAt))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
