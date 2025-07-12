'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus } from 'lucide-react';
import type { Conversation } from '@/lib/types/chat';

interface ParticipantsPanelProps {
  conversation: Conversation;
  show: boolean;
}

export function ParticipantsPanel({ conversation, show }: ParticipantsPanelProps) {
  if (!show || !conversation.isGroup) return null;

  return (
    <div className='p-4 border-b bg-muted/30'>
      <div className='flex justify-between items-center mb-3'>
        <h3 className='font-medium'>Participants ({conversation.participants.length})</h3>
        <Button variant='ghost' size='sm'>
          <UserPlus className='mr-2 w-4 h-4' />
          Add
        </Button>
      </div>
      <div className='flex flex-wrap gap-2'>
        {conversation.participants.map((participant) => (
          <div
            key={participant.id}
            className='flex items-center px-3 py-1 space-x-2 rounded-full bg-background'
          >
            <Avatar className='w-6 h-6'>
              <AvatarImage src={participant.avatar || '/placeholder.svg'} />
              <AvatarFallback className='text-xs'>
                {participant.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <span className='text-sm'>{participant.name}</span>
            {participant.isOnline && <div className='w-2 h-2 bg-green-500 rounded-full' />}
          </div>
        ))}
      </div>
    </div>
  );
}
