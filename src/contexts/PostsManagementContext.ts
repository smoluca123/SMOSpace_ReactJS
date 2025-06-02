import {
  IApiPaginationResponseWrapper,
  IPostDataType,
  IPostDataWithLikedStatusType,
} from '@/lib/types/interfaces';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { createContext } from 'react';

export interface PostsManagementContext {
  infinitePostData: UseInfiniteQueryResult<
    InfiniteData<IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data'], unknown>,
    Error
  >;
  selectedPost: IPostDataType | null;
  selectedPosts: IPostDataType[];
  searchTerm: string;
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  activeTab: string;
  filters: {
    status: string;
    author: string;
  };

  // Actions
  setSelectedPost: React.Dispatch<React.SetStateAction<IPostDataType | null>>;
  setSelectedPosts: React.Dispatch<React.SetStateAction<IPostDataType[]>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setSortField: React.Dispatch<React.SetStateAction<string | null>>;
  setSortDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setFilters: React.Dispatch<React.SetStateAction<{ status: string; author: string }>>;
}

export const PostsManagementContext = createContext<PostsManagementContext | null>(null);
