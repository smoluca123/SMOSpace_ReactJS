import Header from '@/components/Header';
import GroupChatInterface from '@/modules/chat/components/GroupChatInterface';
import GroupChatInterfaceProvider from '@/modules/chat/components/GroupChatInterfaceProvider';

export default function ChatPage() {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <div className='overflow-hidden flex-1 max-h-screen'>
        <GroupChatInterfaceProvider>
          <GroupChatInterface />
        </GroupChatInterfaceProvider>
      </div>
    </div>
  );
}
