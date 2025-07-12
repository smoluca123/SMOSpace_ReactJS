import { Conversation } from '@/lib/types/chat';
import { ChatHeader } from '@/modules/chat/components/ChatHeader';
import MessageInput from '@/modules/chat/components/Message/MessageInput';
import MessageList from '@/modules/chat/components/Message/MessageList';
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
  const { data: messages } = useGetRoomsMessagesQuery({
    roomId: activeConversationId,
  });
  //   const [messages, setMessages] = useState<Message[]>([
  //     {
  //       id: '1',
  //       text: 'Hey! How are you doing today?',
  //       timestamp: new Date(Date.now() - 1000 * 60 * 30),
  //       senderId: 'user1',
  //       senderName: 'Alex Johnson',
  //       senderAvatar: '/placeholder.svg?height=40&width=40',
  //       reactions: [{ emoji: '👍', users: ['You'], count: 1 }],
  //       status: {
  //         sent: true,
  //         delivered: true,
  //         deliveredTo: ['you'],
  //         readBy: ['you'],
  //         timestamp: {
  //           sent: new Date(Date.now() - 1000 * 60 * 30),
  //           delivered: new Date(Date.now() - 1000 * 60 * 29),
  //           read: new Date(Date.now() - 1000 * 60 * 25),
  //         },
  //       },
  //     },
  //     {
  //       id: '2',
  //       text: "I'm doing great! Just finished working on a new project. How about you?",
  //       timestamp: new Date(Date.now() - 1000 * 60 * 25),
  //       senderId: 'you',
  //       senderName: 'You',
  //       senderAvatar: '/placeholder.svg?height=40&width=40',
  //       status: {
  //         sent: true,
  //         delivered: true,
  //         deliveredTo: ['user1'],
  //         readBy: ['user1'],
  //         timestamp: {
  //           sent: new Date(Date.now() - 1000 * 60 * 25),
  //           delivered: new Date(Date.now() - 1000 * 60 * 24),
  //           read: new Date(Date.now() - 1000 * 60 * 20),
  //         },
  //       },
  //     },
  //   ]);

  const currentConversation = conversations.find((c) => c.id === activeConversationId);
  //   const handleSendMessage = (text: string, image?: string) => {
  //     // const participants = currentConversation?.participants.filter((p) => p.id !== 'you') || [];
  //     // const message: Message = {
  //     //   id: Date.now().toString(),
  //     //   text: text || undefined,
  //     //   image: image || undefined,
  //     //   timestamp: new Date(),
  //     //   senderId: 'you',
  //     //   senderName: 'You',
  //     //   senderAvatar: '/placeholder.svg?height=40&width=40',
  //     //   status: {
  //     //     sent: true,
  //     //     delivered: false,
  //     //     deliveredTo: [],
  //     //     readBy: [],
  //     //     timestamp: {
  //     //       sent: new Date(),
  //     //     },
  //     //   },
  //     // };
  //     // setMessages((prev) => [...prev, message]);
  //     // Simulate delivery and read receipts
  //     // setTimeout(() => {
  //     //   setMessages((prev) =>
  //     //     prev.map((msg) =>
  //     //       msg.id === message.id
  //     //         ? {
  //     //             ...msg,
  //     //             status: {
  //     //               ...msg.status!,
  //     //               delivered: true,
  //     //               deliveredTo: participants.map((p) => p.id),
  //     //               timestamp: {
  //     //                 ...msg.status!.timestamp,
  //     //                 delivered: new Date(),
  //     //               },
  //     //             },
  //     //           }
  //     //         : msg,
  //     //     ),
  //     //   );
  //     // }, 1000);
  //     // setTimeout(
  //     //   () => {
  //     //     const readByCount = Math.floor(Math.random() * participants.length) + 1;
  //     //     const readBy = participants.slice(0, readByCount).map((p) => p.id);
  //     //     setMessages((prev) =>
  //     //       prev.map((msg) =>
  //     //         msg.id === message.id
  //     //           ? {
  //     //               ...msg,
  //     //               status: {
  //     //                 ...msg.status!,
  //     //                 readBy,
  //     //                 timestamp: {
  //     //                   ...msg.status!.timestamp,
  //     //                   read: new Date(),
  //     //                 },
  //     //               },
  //     //             }
  //     //           : msg,
  //     //       ),
  //     //     );
  //     //   },
  //     //   3000 + Math.random() * 2000,
  //     // );
  //   };

  //   const handleAddReaction = (messageId: string, emoji: string) => {
  //     setMessages((prev) =>
  //       prev.map((message) => {
  //         if (message.id === messageId) {
  //           const reactions = message.reactions || [];
  //           const existingReaction = reactions.find((r) => r.emoji === emoji);

  //           if (existingReaction) {
  //             if (existingReaction.users.includes('You')) {
  //               return {
  //                 ...message,
  //                 reactions: reactions
  //                   .map((r) =>
  //                     r.emoji === emoji
  //                       ? { ...r, users: r.users.filter((u) => u !== 'You'), count: r.count - 1 }
  //                       : r,
  //                   )
  //                   .filter((r) => r.count > 0),
  //               };
  //             } else {
  //               return {
  //                 ...message,
  //                 reactions: reactions.map((r) =>
  //                   r.emoji === emoji ? { ...r, users: [...r.users, 'You'], count: r.count + 1 } : r,
  //                 ),
  //               };
  //             }
  //           } else {
  //             return {
  //               ...message,
  //               reactions: [...reactions, { emoji, users: ['You'], count: 1 }],
  //             };
  //           }
  //         }
  //         return message;
  //       }),
  //     );
  //   };

  if (!activeConversationId) return null;

  return (
    <div className='flex flex-col flex-1'>
      <ChatHeader
        conversation={currentConversation}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleParticipants={() => setShowParticipants(!showParticipants)}
      />

      <ParticipantsPanel conversation={currentConversation!} show={showParticipants} />

      {messages && (
        <MessageList
          messages={messages}
          //   conversation={currentConversation!}
          isGroup={false}
          //   onAddReaction={handleAddReaction}
          //   onShowReadReceipts={() => {}}
        />
      )}

      <MessageInput
        // onSendMessage={handleSendMessage}
        isGroup={currentConversation?.isGroup || false}
      />
    </div>
  );
}
