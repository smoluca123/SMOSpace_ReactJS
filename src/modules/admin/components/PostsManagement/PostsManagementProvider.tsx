import { PostsManagementContext } from '@/contexts/PostsManagementContext';
import { IPostDataType } from '@/lib/types/interfaces';
import { PropsWithChildren, useState } from 'react';

interface IProps extends PropsWithChildren {
  infinitePostData: PostsManagementContext['infinitePostData'];
}

export default function PostsManagementProvider({ infinitePostData, children }: IProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<IPostDataType | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<IPostDataType[]>([]);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<PostsManagementContext['activeTab']>('all');
  const [filters, setFilters] = useState<PostsManagementContext['filters']>({
    status: 'all',
    author: 'all',
  });

  return (
    <PostsManagementContext
      value={{
        infinitePostData,
        searchTerm,
        setSearchTerm,
        selectedPost,
        setSelectedPost,
        selectedPosts,
        setSelectedPosts,
        sortField,
        setSortField,
        sortDirection,
        setSortDirection,
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
