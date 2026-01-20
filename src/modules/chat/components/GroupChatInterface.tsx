'use client';

import { useEffect, useState } from 'react';
import { Conversation, Participant } from '@/lib/types/chat';
import { CreateGroupDialog } from '@/modules/chat/components/CreateGroupDialog';
import ConversationList from '@/modules/chat/components/Conversation/ConversationList';
import { MessageBox } from '@/modules/chat/components/Message';
import { useParams } from 'react-router-dom';

const AVAILABLE_USERS: Participant[] = [
  {
    id: 'user1',
    name: 'Alex Johnson',
    avatar: '/placeholder.svg?height=40&width=40',
    isOnline: true,
    isTyping: false,
  },
  {
    id: 'user2',
    name: 'Sarah Wilson',
    avatar: '/placeholder.svg?height=40&width=40',
    isOnline: true,
    isTyping: false,
  },
  {
    id: 'user3',
    name: 'Mike Chen',
    avatar: '/placeholder.svg?height=40&width=40',
    isOnline: false,
    isTyping: false,
  },
  {
    id: 'user4',
    name: 'Emma Davis',
    avatar: '/placeholder.svg?height=40&width=40',
    isOnline: true,
    isTyping: false,
  },
  {
    id: 'user5',
    name: 'James Wilson',
    avatar: '/placeholder.svg?height=40&width=40',
    isOnline: true,
    isTyping: false,
  },
  {
    id: 'user6',
    name: 'Lisa Anderson',
    avatar: '/placeholder.svg?height=40&width=40',
    isOnline: false,
    isTyping: false,
  },
];

export default function GroupChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'Check out this amazing view from my hike yesterday!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 20),
      unreadCount: 2,
      isGroup: false,
      participants: [
        {
          id: 'user1',
          name: 'Alex Johnson',
          avatar: '/placeholder.svg?height=40&width=40',
          isOnline: true,
          isTyping: false,
        },
      ],
    },
    {
      id: '2',
      name: 'Design Team',
      lastMessage: 'Sarah: The new mockups look great!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60),
      unreadCount: 3,
      isGroup: true,
      participants: [
        {
          id: 'user2',
          name: 'Sarah Wilson',
          avatar: '/placeholder.svg?height=40&width=40',
          isOnline: true,
          isTyping: true,
        },
        {
          id: 'user4',
          name: 'Emma Davis',
          avatar: '/placeholder.svg?height=40&width=40',
          isOnline: true,
          isTyping: false,
        },
        {
          id: 'user5',
          name: 'James Wilson',
          avatar: '/placeholder.svg?height=40&width=40',
          isOnline: true,
          isTyping: false,
        },
      ],
      createdBy: 'you',
      description: 'Design team collaboration space',
    },
  ]);

  const activeConversationId = useParams().id;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showGroupDialog, setShowGroupDialog] = useState(false);

  const handleCreateGroup = (name: string, participantIds: string[]) => {
    const participants = participantIds
      .map((id) => AVAILABLE_USERS.find((user) => user.id === id)!)
      .filter(Boolean);

    const newGroup: Conversation = {
      id: Date.now().toString(),
      name,
      lastMessage: 'Group created',
      lastMessageTime: new Date(),
      unreadCount: 0,
      isGroup: true,
      participants,
      createdBy: 'you',
      description: `Group chat with ${participants.length} members`,
    };

    setConversations((prev) => [newGroup, ...prev]);
  };

  useEffect(() => {
    // scroll to the bottom of the messages
    const messagesEnd = document.getElementById('messages-end');
    if (messagesEnd) {
      messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversationId]);

  return (
    <div className='flex w-full h-full overflow-hidden bg-background'>
      <ConversationList onCreateGroup={() => setShowGroupDialog(true)} sidebarOpen={sidebarOpen} />

      {activeConversationId && (
        <MessageBox
          conversations={conversations}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeConversationId={activeConversationId}
        />
      )}

      <CreateGroupDialog
        open={showGroupDialog}
        onOpenChange={setShowGroupDialog}
        availableUsers={AVAILABLE_USERS}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
}
