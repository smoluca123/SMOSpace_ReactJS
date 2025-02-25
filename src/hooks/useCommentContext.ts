import { CommentContext } from '@/contexts/CommentContext';
import { useContext } from 'react';

export default function useCommentContext() {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useCommentContext must be used within a CommentProvider');
  }
  return context;
}
