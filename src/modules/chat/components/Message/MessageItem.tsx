'use client';

import UserAvatar from '@/components/UserAvatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatTime } from '@/lib/utils/chat-utils';
import { IChatMessageUI } from '@/apis/types/chat.interfaces';
import { IReactionType, REACTIONS } from '@/lib/reactions';
import MessageReactions from '@/modules/chat/components/Message/MessageReactions';
import ChatSharedPost from '@/modules/chat/components/Message/ChatSharedPost';
import ChatFileMessage from '@/modules/chat/components/Message/ChatFileMessage';
import ChatVoiceMessage from '@/modules/chat/components/Message/ChatVoiceMessage';
import ForwardMessageDialog from '@/modules/chat/components/Message/ForwardMessageDialog';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { ReadReceiptAvatars } from '@/modules/chat/components/ReadReceiptAvatars';
import { cn } from '@/lib/utils';
import {
  Forward,
  Loader2,
  RotateCw,
  SmilePlus,
  TriangleAlert,
  X,
  Phone,
  PhoneMissed,
  Video,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { parseCallMessage, formatCallDuration } from '@/modules/call/callMessage';

interface MessageItemProps {
  message: IChatMessageUI;
  isGroup: boolean;
  onRetry?: (message: IChatMessageUI) => void;
  onDismiss?: (message: IChatMessageUI) => void;
  onReact?: (messageId: string, type: IReactionType) => void;
  onImageClick?: (src: string) => void;
}

export default function MessageItem({
  message,
  isGroup,
  onRetry,
  onDismiss,
  onReact,
  onImageClick,
}: MessageItemProps) {
  const { user } = useAppSelector(selectAuth);
  const isSender = message.sender.id === user?.id;
  const isImage = message.type === 'IMAGE';
  const isPostShare = message.type === 'POST_SHARE';
  const isFile = message.type === 'FILE';
  const isVoice = message.type === 'VOICE';
  const isSending = message.status === 'sending';
  const isFailed = message.status === 'failed';

  // Reactions are only available for messages that exist on the server.
  const canReact = !isSending && !isFailed && !!onReact;

  // Forwarding only makes sense for persisted messages.
  const canForward = !isSending && !isFailed;
  const [forwardOpen, setForwardOpen] = useState(false);

  // Picker open/close coordination (hover with a small close delay, plus
  // long-press for touch devices) - mirrors the post/comment reaction picker.
  const [pickerOpen, setPickerOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setPickerOpen(false), 150);
  };
  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => setPickerOpen(true), 350);
  };
  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlePick = (type: IReactionType) => {
    onReact?.(message.id, type);
    setPickerOpen(false);
  };

  // System messages (e.g. call summaries) render as a centered, full-width note
  // rather than a chat bubble with an avatar.
  if (message.type === 'SYSTEM') {
    const call = parseCallMessage(message.content);
    return (
      <div className='flex justify-center my-1'>
        {call ? (
          <div className='inline-flex gap-2 items-center px-3 py-1.5 text-xs rounded-full bg-muted text-muted-foreground'>
            {call.status === 'missed' ? (
              <PhoneMissed className='w-3.5 h-3.5 text-destructive' />
            ) : call.callType === 'video' ? (
              <Video className='w-3.5 h-3.5' />
            ) : (
              <Phone className='w-3.5 h-3.5' />
            )}
            <span>
              {call.status === 'missed'
                ? call.callType === 'video'
                  ? 'Missed video call'
                  : 'Missed call'
                : `${call.callType === 'video' ? 'Video' : 'Voice'} call · ${formatCallDuration(call.duration)}`}
            </span>
            <span className='opacity-60'>{formatTime(new Date(message.createdAt))}</span>
          </div>
        ) : (
          <span className='px-3 py-1 text-xs text-center text-muted-foreground'>
            {message.content}
          </span>
        )}
      </div>
    );
  }

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

        {/* Forwarded label */}
        {message.isForwarded && (
          <span className='flex gap-1 items-center px-2 mb-0.5 text-xs italic text-muted-foreground'>
            <Forward className='w-3 h-3' /> Forwarded
          </span>
        )}

        {/* Bubble + reaction trigger sit on one row so the trigger appears
            beside the message on hover. */}
        <div className={cn('flex items-center gap-1', isSender ? 'flex-row-reverse' : 'flex-row')}>
          {isPostShare ? (
            <ChatSharedPost postId={message.content} />
          ) : isFile ? (
            <ChatFileMessage content={message.content} isSender={isSender} />
          ) : isVoice ? (
            <ChatVoiceMessage content={message.content} isSender={isSender} />
          ) : isImage ? (
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

          <div
            className={cn('flex items-center gap-0.5', isSender ? 'flex-row-reverse' : 'flex-row')}
          >
            {canForward && (
              <button
                type='button'
                aria-label='Forward message'
                title='Forward'
                onClick={() => setForwardOpen(true)}
                className='flex justify-center items-center w-7 h-7 rounded-full opacity-0 transition-opacity text-muted-foreground hover:bg-muted group-hover:opacity-100 focus:opacity-100'
              >
                <Forward className='w-4 h-4' />
              </button>
            )}

            {canReact && (
              <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                <PopoverTrigger asChild>
                  <button
                    type='button'
                    aria-label='React to message'
                    className='flex justify-center items-center w-7 h-7 rounded-full opacity-0 transition-opacity text-muted-foreground hover:bg-muted group-hover:opacity-100 focus:opacity-100'
                    onMouseEnter={() => {
                      cancelClose();
                      setPickerOpen(true);
                    }}
                    onMouseLeave={scheduleClose}
                    onTouchStart={startLongPress}
                    onTouchEnd={cancelLongPress}
                    onTouchCancel={cancelLongPress}
                  >
                    <SmilePlus className='w-4 h-4' />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side='top'
                  align={isSender ? 'end' : 'start'}
                  sideOffset={6}
                  className='flex gap-1 p-1 w-auto rounded-full border shadow-md'
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                >
                  {REACTIONS.map((reaction) => (
                    <button
                      key={reaction.type}
                      type='button'
                      title={reaction.label}
                      aria-label={reaction.label}
                      onClick={() => handlePick(reaction.type)}
                      className='flex justify-center items-center w-9 h-9 text-xl rounded-full transition-transform hover:scale-125 hover:bg-muted'
                    >
                      {reaction.emoji}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Reaction summary chips */}
        {canReact && (
          <MessageReactions
            reactions={message.reactions}
            currentUserId={user?.id}
            isSender={isSender}
            onToggle={(type) => onReact?.(message.id, type)}
          />
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

      {canForward && (
        <ForwardMessageDialog
          messageId={message.id}
          open={forwardOpen}
          onClose={() => setForwardOpen(false)}
        />
      )}
    </div>
  );
}
