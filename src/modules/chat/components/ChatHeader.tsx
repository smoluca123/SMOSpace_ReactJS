import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DropdownMenuItemWithIcon from '@/components/DropdownMenuItemWithIcon';
import UserAvatar from '@/components/UserAvatar';
import BlockMenuItem from '@/modules/profile/components/Profile/ProfileHeader/ProfileActions/BlockMenuItem';
import {
  ArrowLeft,
  Bell,
  BellOff,
  MoreVertical,
  Phone,
  Trash2,
  User,
  Users,
  Video,
} from 'lucide-react';
import { UUID } from 'crypto';
import { useNavigate } from 'react-router-dom';
import { IChatRoomsDataType } from '@/apis/types/chat.interfaces';
import { toast } from '@/hooks/use-toast';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useCall } from '@/modules/call/CallContext';
import {
  useDeleteConversation,
  useToggleMuteConversation,
} from '@/modules/chat/components/Conversation/mutations';

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
  const navigate = useNavigate();
  const { startCall, status: callStatus } = useCall();
  const toggleMute = useToggleMuteConversation();
  const deleteConversation = useDeleteConversation();

  if (!room) return null;

  const isGroup = room.type === 'GROUP';
  const otherParticipant = !isGroup
    ? room.participants.find((p) => p.user.id !== user?.id)
    : undefined;

  const myParticipant = room.participants.find((p) => p.user.id === user?.id);
  const isMuted = !!myParticipant?.isMuted;

  const title = isGroup
    ? room.name || 'Group chat'
    : otherParticipant?.user.fullName || otherParticipant?.user.username || 'Conversation';

  const someoneElseTyping = typingUsers.some((id) => id !== user?.id);

  const handleCall = (kind: 'audio' | 'video') => {
    if (callStatus !== 'idle') {
      toast({ title: 'You are already in a call', duration: 2500 });
      return;
    }
    startCall(room.id, kind === 'audio' ? 'audio' : 'video');
  };

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

      <div className='flex items-center space-x-1'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => handleCall('audio')}
          aria-label='Voice call'
        >
          <Phone className='w-5 h-5' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => handleCall('video')}
          aria-label='Video call'
        >
          <Video className='w-5 h-5' />
        </Button>

        {isGroup && (
          <Button variant='ghost' size='icon' onClick={onToggleParticipants}>
            <Users className='w-5 h-5' />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' aria-label='More options'>
              <MoreVertical className='w-5 h-5' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            {!isGroup && otherParticipant && (
              <DropdownMenuItemWithIcon
                Icon={User}
                onClick={() => navigate(`/profile/${otherParticipant.user.username}`)}
              >
                Visit profile
              </DropdownMenuItemWithIcon>
            )}

            <DropdownMenuItemWithIcon
              Icon={isMuted ? Bell : BellOff}
              onClick={() => toggleMute.mutate({ roomId: room.id })}
            >
              {isMuted ? 'Turn on notifications' : 'Turn off notifications'}
            </DropdownMenuItemWithIcon>

            {!isGroup && otherParticipant && (
              <BlockMenuItem
                userId={otherParticipant.user.id as UUID}
                fullName={otherParticipant.user.fullName}
              />
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItemWithIcon
              Icon={Trash2}
              variant='destructive'
              onClick={() => {
                deleteConversation.mutate({ roomId: room.id });
                navigate('/chat');
              }}
            >
              Delete conversation
            </DropdownMenuItemWithIcon>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
