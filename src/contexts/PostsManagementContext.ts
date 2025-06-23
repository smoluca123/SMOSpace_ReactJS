import { IPostDataType } from '@/lib/types/interfaces';

import { createContext } from 'react';

export interface PostsManagementContext {
  selectedPost: IPostDataType | null;
  selectedPosts: IPostDataType[];
  activeTab: string;
  filters: {
    status: string;
    author: string;
  };

  // Actions
  setSelectedPost: React.Dispatch<React.SetStateAction<IPostDataType | null>>;
  setSelectedPosts: React.Dispatch<React.SetStateAction<IPostDataType[]>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setFilters: React.Dispatch<React.SetStateAction<{ status: string; author: string }>>;
}

export const PostsManagementContext = createContext<PostsManagementContext | null>(null);
