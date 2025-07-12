'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Message, Conversation } from '@/lib/types/chat';

interface ReadReceiptAvatarsProps {
  message: Message;
  conversation: Conversation;
  isGroup: boolean;
}

export function ReadReceiptAvatars({ message, conversation, isGroup }: ReadReceiptAvatarsProps) {
  if (message.senderId !== 'you' || !message.status || message.status.readBy.length === 0) {
    return null;
  }

  const participants = conversation.participants.filter((p) => p.id !== 'you');
  const readByParticipants = participants.filter((p) => message.status!.readBy.includes(p.id));
  const maxAvatars = 3;
  const showCount = readByParticipants.length > maxAvatars;

  return (
    <div className='flex items-center mt-2 -mb-1'>
      <div className='flex -space-x-1'>
        {readByParticipants.slice(0, maxAvatars).map((participant) => (
          <div
            key={participant.id}
            className='relative group'
            title={`Read by ${participant.name}`}
          >
            <Avatar className='w-4 h-4 border ring-1 border-background ring-background'>
              <AvatarImage src={participant.avatar || '/placeholder.svg'} />
              <AvatarFallback className='text-xs text-[8px]'>
                {participant.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            {/* Tooltip */}
            <div className='absolute bottom-full left-1/2 z-10 px-2 py-1 mb-1 text-xs text-white whitespace-nowrap bg-black rounded opacity-0 transition-opacity transform -translate-x-1/2 pointer-events-none group-hover:opacity-100'>
              {participant.name}
            </div>
          </div>
        ))}
        {showCount && (
          <div
            className='relative group'
            title={`Read by ${readByParticipants
              .slice(maxAvatars)
              .map((p) => p.name)
              .join(', ')}`}
          >
            <div className='flex justify-center items-center w-4 h-4 rounded-full border ring-1 bg-muted border-background ring-background'>
              <span className='text-[8px] font-medium text-muted-foreground'>
                +{readByParticipants.length - maxAvatars}
              </span>
            </div>
            {/* Tooltip */}
            <div className='absolute bottom-full left-1/2 z-10 px-2 py-1 mb-1 text-xs text-white whitespace-nowrap bg-black rounded opacity-0 transition-opacity transform -translate-x-1/2 pointer-events-none group-hover:opacity-100 max-w-48'>
              {readByParticipants
                .slice(maxAvatars)
                .map((p) => p.name)
                .join(', ')}
            </div>
          </div>
        )}
      </div>
      {isGroup && message.status.readBy.length > 0 && (
        <span className='ml-2 text-xs text-muted-foreground'>
          {message.status.readBy.length === 1 ? 'Seen' : `Seen by ${message.status.readBy.length}`}
        </span>
      )}
    </div>
  );
}
