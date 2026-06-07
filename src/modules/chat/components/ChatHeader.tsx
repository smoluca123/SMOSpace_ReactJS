import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UserAvatar from '@/components/UserAvatar';
import { ArrowLeft, Users } from 'lucide-react';
import { IChatRoomsDataType } from '@/apis/types/chat.interfaces';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

interface ChatHeaderProps {
  room: IChatRoomsDataType | undefined;
  typingUsers?: string[];
  onBack?: () => void;
  onToggleParticipants: () => void;
}

export function ChatHeader({
  room,
  typingUsers = [],
  onBack,
  onToggleParticipants,
}: ChatHeaderProps) {
  const { user } = useAppSelector(selectAuth);
  if (!room) return null;

  const isGroup = room.type === 'GROUP';
  const otherParticipant = !isGroup
    ? room.participants.find((p) => p.user.id !== user?.id)
    : undefined;

  const title = isGroup
    ? room.name || 'Group chat'
    : otherParticipant?.user.fullName || otherParticipant?.user.username || 'Conversation';

  const someoneElseTyping = typingUsers.some((id) => id !== user?.id);

  return (
    <div className='flex justify-between items-center p-4 border-b bg-card'>
      <div className='flex items-center space-x-3'>
        <Button variant='ghost' size='icon' className='lg:hidden' onClick={onBack}>
          <ArrowLeft className='w-5 h-5' />
        </Button>

        {isGroup ? (
          <div className='flex justify-center items-center w-10 h-10 rounded-full bg-muted'>
            <Users className='w-5 h-5 text-muted-foreground' />
          </div>
        ) : (
          <UserAvatar
            userId={otherParticipant?.user.id}
            avatarUrl={otherParticipant?.user.avatar}
            fallbackName={otherParticipant?.user.fullName}
            className='w-10 h-10'
          />
        )}

        <div>
          <div className='flex items-center space-x-2'>
            <h2 className='text-lg font-semibold'>{title}</h2>
            {isGroup && (
              <Badge variant='outline' className='text-xs'>
                {room.participants.length} members
              </Badge>
            )}
          </div>
          <p className='text-sm text-muted-foreground'>
            {someoneElseTyping ? 'Typing...' : isGroup ? `${room.participants.length} members` : ''}
          </p>
        </div>
      </div>

      <div className='flex items-center space-x-2'>
        {isGroup && (
          <Button variant='ghost' size='icon' onClick={onToggleParticipants}>
            <Users className='w-5 h-5' />
          </Button>
        )}
      </div>
    </div>
  );
}
