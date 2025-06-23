import { PostsManagementContext } from '@/contexts/PostsManagementContext';
import { IPostDataType } from '@/lib/types/interfaces';
import { PropsWithChildren, useState } from 'react';

export default function PostsManagementProvider({ children }: PropsWithChildren) {
  const [selectedPost, setSelectedPost] = useState<IPostDataType | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<IPostDataType[]>([]);
  const [activeTab, setActiveTab] = useState<PostsManagementContext['activeTab']>('all');
  const [filters, setFilters] = useState<PostsManagementContext['filters']>({
    status: 'all',
    author: 'all',
  });

  return (
    <PostsManagementContext
      value={{
        selectedPost,
        setSelectedPost,
        selectedPosts,
        setSelectedPosts,
        activeTab,
        setActiveTab,
        filters,
        setFilters,
      }}
    >
      {children}
    </PostsManagementContext>
  );
}
