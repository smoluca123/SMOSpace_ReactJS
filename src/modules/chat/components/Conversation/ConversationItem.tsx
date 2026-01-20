import { IChatRoomsDataType } from '@/apis/types/chat.interfaces';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import UserAvatar from '@/components/UserAvatar';
import { formatLastMessageTime } from '@/lib/utils/chat-utils';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ConversationItem({ conversation }: { conversation: IChatRoomsDataType }) {
  const activeConversationId = useParams().id;
  const navigate = useNavigate();
  const { user } = useAppSelector(selectAuth);

  if (!user) return null;
  const isGroup = conversation.type === 'GROUP';
  const directReceiverUser = !isGroup
    ? conversation.participants.find((participant) => participant.user.id !== user.id)
    : null;

  return (
    <div
      key={conversation.id}
      onClick={() => navigate(`/chat/${conversation.id}`)}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 w-full ${
        activeConversationId === conversation.id ? 'bg-muted' : ''
      }`}
    >
      <div className='relative'>
        {isGroup ? (
          <div className='relative w-12 h-12'>
            <div className='absolute inset-0 flex items-center justify-center rounded-full bg-muted'>
              <Users className='w-6 h-6 text-muted-foreground' />
            </div>
            {conversation.participants.slice(0, 2).map((participant, index) => (
              <Avatar
                key={participant.id}
                className={`absolute h-6 w-6 border-2 border-background ${
                  index === 0 ? 'top-0 right-0' : 'bottom-0 left-0'
                }`}
              >
                <AvatarImage src={participant.user.avatar || '/placeholder.svg'} />
                <AvatarFallback className='text-xs'>
                  {participant.user.username
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        ) : (
          <UserAvatar
            avatarUrl={directReceiverUser?.user.avatar}
            fallbackName={directReceiverUser?.user.username}
          />
        )}
        {!isGroup && directReceiverUser?.user.username === 'online' && (
          <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full border-background' />
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <h3 className='font-medium truncate'>
              {conversation.name || directReceiverUser?.user.fullName}
            </h3>
            {isGroup && (
              <Badge variant='secondary' className='text-xs'>
                {conversation.participants.length}
              </Badge>
            )}
          </div>
          <span className='text-xs text-muted-foreground'>
            {formatLastMessageTime(new Date(conversation.lastMessage.createdAt))}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <p className='w-3/4 text-sm truncate text-muted-foreground'>
            {conversation.lastMessage.sender.id === user.id ? 'You: ' : ' '}
            {conversation.lastMessage.content}
          </p>
          {/* {conversation.unreadCount > 0 && (
            <Badge
              variant='default'
              className='flex items-center justify-center w-5 h-5 p-0 text-xs'
            >
              {conversation.unreadCount}
            </Badge>
          )} */}
        </div>
      </div>
    </div>
  );
}
