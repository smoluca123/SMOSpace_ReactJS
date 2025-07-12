'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Smile } from 'lucide-react';
import { formatTime, EMOJI_REACTIONS } from '@/lib/utils/chat-utils';
import { IRoomMessageDataType } from '@/apis/types/chat.interfaces';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

interface MessageItemProps {
  message: IRoomMessageDataType;
  isGroup: boolean;
  // onAddReaction: (messageId: string, emoji: string) => void;
  // onShowReadReceipts: (messageId: string) => void;
}

export default function MessageItem({
  message,
  isGroup,
  // onAddReaction,
  // onShowReadReceipts,
}: MessageItemProps) {
  const [showReactions, setShowReactions] = useState(false);
  const { user } = useAppSelector(selectAuth);

  const isSender = message.sender.id === user?.id;

  const getMessageStatusIcon = () => {
    if (!isSender) return null;

    // const { sent, delivered, readBy, deliveredTo } = message.status;
    const sent = true;
    const delivered = true;
    const readBy = message.readBy;
    const totalParticipants = isGroup ? (message.room.participants.length || 1) - 1 : 1;

    if (!sent) {
      return <div className='w-4 h-4 rounded-full border animate-spin border-muted-foreground' />;
    }

    if (!delivered) {
      return <span className='text-sm text-muted-foreground'>✓</span>;
    }

    if (isGroup) {
      const readCount = message.readBy.length;
      const deliveredCount = message.readBy.length;

      if (readCount === totalParticipants) {
        return <span className='text-sm font-medium text-blue-500'>✓✓</span>;
      } else if (readCount > 0) {
        return <span className='text-sm font-medium text-blue-400'>✓✓</span>;
      } else if (deliveredCount === totalParticipants) {
        return <span className='text-sm text-muted-foreground'>✓✓</span>;
      } else {
        return <span className='text-sm text-muted-foreground'>✓</span>;
      }
    } else {
      if (readBy.length > 0) {
        return <span className='text-sm font-medium text-blue-500'>✓✓</span>;
      } else {
        return <span className='text-sm text-muted-foreground'>✓✓</span>;
      }
    }
  };

  return (
    <div
      className={`flex items-start space-x-3 group ${
        message.sender.id === user?.id ? 'flex-row-reverse space-x-reverse' : ''
      }`}
    >
      <Avatar className='flex-shrink-0 w-8 h-8'>
        <AvatarImage src={message.sender.avatar || '/placeholder.svg'} />
        <AvatarFallback>
          {message.sender.fullName
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </AvatarFallback>
      </Avatar>

      <div
        className={`flex flex-col max-w-xs sm:max-w-md lg:max-w-lg ${
          isSender ? 'items-end' : 'items-start'
        }`}
      >
        {/* Sender name for group chats */}
        {isGroup && !isSender && (
          <span className='px-2 mb-1 text-xs text-muted-foreground'>{message.sender.fullName}</span>
        )}

        <div
          className={`rounded-2xl px-4 py-2 relative ${
            isSender ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}
          onDoubleClick={() => setShowReactions(!showReactions)}
        >
          {/* {message.image && (
            <div className='mb-2'>
              <img
                src={message.image || '/placeholder.svg'}
                alt='Shared image'
                className='max-w-full h-auto rounded-lg'
                style={{ maxHeight: '200px' }}
              />
            </div>
          )} */}
          {message.type === 'TEXT' && <p className='text-sm leading-relaxed'>{message.content}</p>}

          {/* Reaction Button */}
          <Button
            variant='ghost'
            size='sm'
            className='absolute -right-2 -bottom-2 p-0 w-6 h-6 border shadow-sm opacity-0 transition-opacity group-hover:opacity-100 bg-background'
            onClick={() => setShowReactions(!showReactions)}
          >
            <Smile className='w-3 h-3' />
          </Button>
        </div>

        {/* Reactions */}
        {/* {message.reactions && message.reactions.length > 0 && (
          <div className='flex flex-wrap gap-1 mt-1'>
            {message.reactions.map((reaction, index) => (
              <Button
                key={index}
                variant='outline'
                size='sm'
                className='px-2 h-6 text-xs'
                onClick={() => onAddReaction(message.id, reaction.emoji)}
              >
                {reaction.emoji} {reaction.count}
              </Button>
            ))}
          </div>
        )} */}

        {/* Reaction Picker */}
        {showReactions && (
          <div className='flex gap-1 p-2 mt-2 rounded-lg border shadow-lg bg-background'>
            {EMOJI_REACTIONS.map((emoji) => (
              <Button
                key={emoji}
                variant='ghost'
                size='sm'
                className='p-0 w-8 h-8 hover:bg-muted'
                onClick={() => {
                  // onAddReaction(message.id, emoji);
                  setShowReactions(false);
                }}
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}

        {/* Read Receipt Avatars */}
        {/* <ReadReceiptAvatars message={message} conversation={conversation} isGroup={isGroup} /> */}

        <div className='flex items-center mt-1 space-x-2'>
          <span className='text-xs text-muted-foreground'>
            {formatTime(new Date(message.createdAt))}
          </span>
          {isSender && !message.readBy.length && (
            <div
              className='flex items-center cursor-pointer'
              // onClick={() => isGroup && onShowReadReceipts(message.id)}
            >
              {getMessageStatusIcon()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
