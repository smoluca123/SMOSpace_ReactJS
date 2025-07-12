import { GroupChatInterfaceContext } from '@/contexts/GroupChatInterfaceContext';
import { useContext } from 'react';

export const useGroupChatInterfaceContext = () => {
  const context = useContext(GroupChatInterfaceContext);
  if (!context) {
    throw new Error(
      'useGroupChatInterfaceContext must be used within a GroupChatInterfaceProvider',
    );
  }
  return context;
};
