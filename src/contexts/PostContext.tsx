import { IPostDataWithLikedStatusType } from '@/lib/types/interfaces';
import { createContext } from 'react';

interface IPostContext {
  post: IPostDataWithLikedStatusType;
}

export const PostContext = createContext<IPostContext | null>(null);
