import { Conversation } from '@/lib/types/chat';
import { ChatHeader } from '@/modules/chat/components/ChatHeader';
import MessageInput from '@/modules/chat/components/Message/MessageInput';
import MessageList from '@/modules/chat/components/Message/MessageList';
import { MessageSkeletons } from '@/modules/chat/components/Message/MessageSkeleton';
import { useGetRoomsMessagesQuery } from '@/modules/chat/components/Message/querys';
import { ParticipantsPanel } from '@/modules/chat/components/ParticipantsPanel';
import { useState } from 'react';

export default function MessageBox({
  conversations,
  sidebarOpen,
  setSidebarOpen,
  activeConversationId,
}: {
  conversations: Conversation[];
  sidebarOpen: boolean;
  activeConversationId: string;
  setSidebarOpen: (sidebarOpen: boolean) => void;
}) {
  const [showParticipants, setShowParticipants] = useState(false);
  const { data: messages, isFetching } = useGetRoomsMessagesQuery({
    roomId: activeConversationId,
  });

  const currentConversation = conversations.find((c) => c.id === activeConversationId);

  if (!activeConversationId) return null;

  return (
    <div className='flex flex-col flex-1'>
      <ChatHeader
        conversation={currentConversation}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleParticipants={() => setShowParticipants(!showParticipants)}
      />

      <ParticipantsPanel conversation={currentConversation!} show={showParticipants} />

      {!isFetching && messages && <MessageList messages={messages} isGroup={false} />}
      {isFetching && <MessageSkeletons />}

      <MessageInput isGroup={currentConversation?.isGroup || false} />
    </div>
  );
}
