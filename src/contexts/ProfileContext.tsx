import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import { createContext } from 'react';

interface IProfileContext {
  userData: IUserDataWithFollowedStatusType;
  isMe: boolean;
}

export const ProfileContext = createContext<IProfileContext | null>(null);
