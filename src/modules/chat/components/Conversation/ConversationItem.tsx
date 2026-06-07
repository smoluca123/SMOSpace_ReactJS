import { IChatRoomsDataType } from '@/apis/types/chat.interfaces';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DropdownMenuItemWithIcon from '@/components/DropdownMenuItemWithIcon';
import UserAvatar from '@/components/UserAvatar';
import BlockMenuItem from '@/modules/profile/components/Profile/ProfileHeader/ProfileActions/BlockMenuItem';
import { formatLastMessageTime } from '@/lib/utils/chat-utils';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import {
  Bell,
  BellOff,
  MailCheck,
  MailOpen,
  MoreVertical,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { UUID } from 'crypto';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useDeleteConversation,
  useMarkConversationRead,
  useMarkConversationUnread,
  useToggleMuteConversation,
} from '@/modules/chat/components/Conversation/mutations';

export default function ConversationItem({ conversation }: { conversation: IChatRoomsDataType }) {
  const activeConversationId = useParams().id;
  const navigate = useNavigate();
  const { user } = useAppSelector(selectAuth);

  const markRead = useMarkConversationRead();
  const markUnread = useMarkConversationUnread();
  const toggleMute = useToggleMuteConversation();
  const deleteConversation = useDeleteConversation();

  if (!user) return null;
  const isGroup = conversation.type === 'GROUP';
  const directReceiverUser = !isGroup
    ? conversation.participants.find((participant) => participant.user.id !== user.id)
    : null;

  const myParticipant = conversation.participants.find((p) => p.user.id === user.id);
  const isMuted = !!myParticipant?.isMuted;
  const hasUnread = !!conversation.unreadCount && conversation.unreadCount > 0;

  const handleOpen = () => {
    if (hasUnread) markRead.mutate({ roomId: conversation.id });
    navigate(`/chat/${conversation.id}`);
  };

  return (
    <div
      onClick={handleOpen}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 w-full group ${
        activeConversationId === conversation.id ? 'bg-muted' : ''
      }`}
    >
      <div className='relative'>
        {isGroup ? (
          <div className='flex justify-center items-center w-12 h-12 rounded-full bg-muted'>
            <Users className='w-6 h-6 text-muted-foreground' />
          </div>
        ) : (
          <UserAvatar
            userId={directReceiverUser?.user.id}
            avatarUrl={directReceiverUser?.user.avatar}
            fallbackName={directReceiverUser?.user.username}
          />
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2 min-w-0'>
            <h3 className={`truncate ${hasUnread ? 'font-bold' : 'font-medium'}`}>
              {conversation.name || directReceiverUser?.user.fullName}
            </h3>
            {isMuted && <BellOff className='flex-shrink-0 w-3 h-3 text-muted-foreground' />}
          </div>
          <span className='text-xs text-muted-foreground'>
            {conversation.lastMessage
              ? formatLastMessageTime(new Date(conversation.lastMessage.createdAt))
              : ''}
          </span>
        </div>
        <div className='flex items-center justify-between gap-2'>
          <p
            className={`flex-1 text-sm truncate ${
              hasUnread ? 'font-semibold text-foreground' : 'text-muted-foreground'
            }`}
          >
            {conversation.lastMessage ? (
              <>
                {conversation.lastMessage.sender.id === user.id ? 'You: ' : ' '}
                {conversation.lastMessage.type === 'IMAGE'
                  ? 'Sent an image'
                  : conversation.lastMessage.content}
              </>
            ) : (
              <span className='italic'>No messages yet</span>
            )}
          </p>

          <div className='flex items-center gap-1'>
            {hasUnread && (
              <Badge
                variant='default'
                className='flex items-center justify-center min-w-5 h-5 p-0 px-1 text-xs'
              >
                {conversation.unreadCount! > 99 ? '99+' : conversation.unreadCount}
              </Badge>
            )}

            {/* Options menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant='ghost'
                  size='icon'
                  className='w-7 h-7 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100'
                >
                  <MoreVertical className='w-4 h-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-56'
                onClick={(e) => e.stopPropagation()}
              >
                {hasUnread ? (
                  <DropdownMenuItemWithIcon
                    Icon={MailCheck}
                    onClick={() => markRead.mutate({ roomId: conversation.id })}
                  >
                    Mark as read
                  </DropdownMenuItemWithIcon>
                ) : (
                  <DropdownMenuItemWithIcon
                    Icon={MailOpen}
                    onClick={() => markUnread.mutate({ roomId: conversation.id })}
                  >
                    Mark as unread
                  </DropdownMenuItemWithIcon>
                )}

                <DropdownMenuItemWithIcon
                  Icon={isMuted ? Bell : BellOff}
                  onClick={() => toggleMute.mutate({ roomId: conversation.id })}
                >
                  {isMuted ? 'Turn on notifications' : 'Turn off notifications'}
                </DropdownMenuItemWithIcon>

                {!isGroup && directReceiverUser && (
                  <DropdownMenuItemWithIcon
                    Icon={User}
                    onClick={() => navigate(`/profile/${directReceiverUser.user.username}`)}
                  >
                    Visit profile
                  </DropdownMenuItemWithIcon>
                )}

                {!isGroup && directReceiverUser && (
                  <BlockMenuItem
                    userId={directReceiverUser.user.id as UUID}
                    fullName={directReceiverUser.user.fullName}
                  />
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItemWithIcon
                  Icon={Trash2}
                  variant='destructive'
                  onClick={() => {
                    deleteConversation.mutate({ roomId: conversation.id });
                    if (activeConversationId === conversation.id) navigate('/chat');
                  }}
                >
                  Delete conversation
                </DropdownMenuItemWithIcon>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
