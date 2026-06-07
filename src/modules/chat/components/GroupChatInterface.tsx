'use client';

import { useState } from 'react';
import ConversationList from '@/modules/chat/components/Conversation/ConversationList';
import { MessageBox } from '@/modules/chat/components/Message';
import { CreateGroupDialog } from '@/modules/chat/components/CreateGroupDialog';
import MessageRequestsView from '@/modules/chat/components/Conversation/MessageRequestsView';
import { useGetActiveChatRoomsQuery } from '@/modules/chat/components/Conversation/querys';
import { useGetMessageRequests } from '@/modules/chat/components/Conversation/requestQuerys';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';

export default function GroupChatInterface() {
  const activeConversationId = useParams().id;
  const navigate = useNavigate();
  const [showGroupDialog, setShowGroupDialog] = useState(false);

  const isRequestsView = activeConversationId === 'requests';

  const { data: activeRooms } = useGetActiveChatRoomsQuery();
  const { data: requestRooms } = useGetMessageRequests();

  const currentRoom =
    activeRooms?.pages
      .flatMap((page) => page.items)
      .find((room) => room.id === activeConversationId) ||
    requestRooms?.pages
      .flatMap((page) => page.items)
      .find((room) => room.id === activeConversationId);

  const isDetailOpen = !!activeConversationId;

  return (
    <div className='flex overflow-hidden w-full h-full bg-background'>
      {/* Conversation list: always visible on desktop, hidden on mobile when a chat/view is open */}
      <div
        className={cn(
          'flex-col w-full border-r shrink-0 lg:flex lg:w-80',
          isDetailOpen ? 'hidden lg:flex' : 'flex',
        )}
      >
        <ConversationList onCreateGroup={() => setShowGroupDialog(true)} />
      </div>

      {/* Detail area: full screen on mobile when open */}
      <div className={cn('flex-1', isDetailOpen ? 'flex' : 'hidden lg:flex')}>
        {isRequestsView ? (
          <MessageRequestsView />
        ) : activeConversationId ? (
          <MessageBox
            room={currentRoom}
            activeConversationId={activeConversationId}
            onBack={() => navigate('/chat')}
          />
        ) : (
          <div className='flex flex-col flex-1 gap-2 justify-center items-center text-muted-foreground'>
            <MessageSquare className='w-10 h-10' />
            <p>Select a conversation to get started</p>
          </div>
        )}
      </div>

      <CreateGroupDialog open={showGroupDialog} onOpenChange={setShowGroupDialog} />
    </div>
  );
}
