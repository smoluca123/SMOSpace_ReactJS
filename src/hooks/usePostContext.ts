import { PostContext } from '@/contexts/PostContext';
import { useContext } from 'react';

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePostContext must be used within a PostProvider');
  return context;
};
