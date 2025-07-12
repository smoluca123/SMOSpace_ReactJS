import { createContext, Dispatch, SetStateAction } from 'react';

interface IGroupChatInterfaceContext {
  activeConversationId: string | null;
  setActiveConversationId: Dispatch<SetStateAction<string | null>>;
}

export const GroupChatInterfaceContext = createContext<IGroupChatInterfaceContext | null>(null);
