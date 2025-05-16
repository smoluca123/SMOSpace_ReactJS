import { IUserDataType } from '@/lib/types/interfaces';
import { createContext } from 'react';

interface IProfileUpdateAvatarContext {
  userData: IUserDataType;
  isMe: boolean;
}

export const ProfileUpdateAvatarContext = createContext<IProfileUpdateAvatarContext | null>(null);
