import { useContext } from 'react';
import { PostsManagementContext } from '@/contexts/PostsManagementContext';

export default function usePostsManagementContext() {
  const context = useContext(PostsManagementContext);

  if (!context) {
    throw new Error('usePostsManagementContext must be used within a PostsManagementProvider');
  }

  return context;
}
