import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Phone, Video, Users, Settings } from 'lucide-react';
import type { Conversation } from '@/lib/types/chat';
import { getTypingUsers } from '@/lib/utils/chat-utils';

interface ChatHeaderProps {
  conversation: Conversation | undefined;
  onToggleSidebar: () => void;
  onToggleParticipants: () => void;
}

export function ChatHeader({
  conversation,
  onToggleSidebar,
  onToggleParticipants,
}: ChatHeaderProps) {
  if (!conversation) return null;

  const isGroup = conversation.isGroup;

  return (
    <div className='flex justify-between items-center p-4 border-b bg-card'>
      <div className='flex items-center space-x-3'>
        <Button variant='ghost' size='icon' className='lg:hidden' onClick={onToggleSidebar}>
          <MoreVertical className='w-5 h-5' />
        </Button>

        {isGroup ? (
          <div className='relative w-10 h-10'>
            <div className='flex absolute inset-0 justify-center items-center rounded-full bg-muted'>
              <Users className='w-5 h-5 text-muted-foreground' />
            </div>
            {conversation.participants.slice(0, 2).map((participant, index) => (
              <Avatar
                key={participant.id}
                className={`absolute h-5 w-5 border border-background ${
                  index === 0 ? 'top-0 right-0' : 'bottom-0 left-0'
                }`}
              >
                <AvatarImage src={participant.avatar || '/placeholder.svg'} />
                <AvatarFallback className='text-xs'>
                  {participant.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        ) : (
          <Avatar className='w-10 h-10'>
            <AvatarImage src={conversation.avatar || '/placeholder.svg'} />
            <AvatarFallback>
              {conversation.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
        )}

        <div>
          <div className='flex items-center space-x-2'>
            <h2 className='text-lg font-semibold'>{conversation.name}</h2>
            {isGroup && (
              <Badge variant='outline' className='text-xs'>
                {conversation.participants.length} members
              </Badge>
            )}
          </div>
          <p className='text-sm text-muted-foreground'>
            {isGroup
              ? getTypingUsers(conversation) ||
                `${conversation.participants.filter((p) => p.isOnline).length} online`
              : getTypingUsers(conversation) ||
                (conversation.participants[0]?.isOnline ? 'Online' : 'Offline')}
          </p>
        </div>
      </div>

      <div className='flex items-center space-x-2'>
        {!isGroup && (
          <>
            <Button variant='ghost' size='icon'>
              <Phone className='w-5 h-5' />
            </Button>
            <Button variant='ghost' size='icon'>
              <Video className='w-5 h-5' />
            </Button>
          </>
        )}
        {isGroup && (
          <Button variant='ghost' size='icon' onClick={onToggleParticipants}>
            <Users className='w-5 h-5' />
          </Button>
        )}
        <Button variant='ghost' size='icon'>
          <Settings className='w-5 h-5' />
        </Button>
      </div>
    </div>
  );
}
