import { IFriendRequestWithFriendDataType } from '@/lib/types/interfaces';
import { createContext } from 'react';

interface IFriendRequestContext {
  friendRequest: IFriendRequestWithFriendDataType;
}

export const FriendRequestContext = createContext<IFriendRequestContext | null>(null);
