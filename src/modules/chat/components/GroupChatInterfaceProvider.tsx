import { GroupChatInterfaceContext } from '@/contexts/GroupChatInterfaceContext';
import { useState } from 'react';

interface IGroupChatInterfaceProviderProps extends React.PropsWithChildren {
  defaultConversationId?: string;
}

export default function GroupChatInterfaceProvider({
  children,
  defaultConversationId,
}: IGroupChatInterfaceProviderProps) {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    defaultConversationId || null,
  );

  return (
    <GroupChatInterfaceContext.Provider value={{ activeConversationId, setActiveConversationId }}>
      {children}
    </GroupChatInterfaceContext.Provider>
  );
}
