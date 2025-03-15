import { IUserDataType } from '@/lib/types/interfaces';
import { createContext } from 'react';

interface IProfileContext {
  userData: IUserDataType;
  isMe: boolean;
}

export const ProfileContext = createContext<IProfileContext | null>(null);
