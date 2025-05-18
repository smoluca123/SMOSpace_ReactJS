import { FriendRequestContext } from '@/contexts/FriendRequestContext';
import { useContext } from 'react';

export default function useFriendRequestContext() {
  const context = useContext(FriendRequestContext);
  if (!context) {
    throw new Error('useFriendRequestContext must be used within a FriendRequestProvider');
  }
  return context;
}
