import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import { createContext } from 'react';

interface IProfileContext {
  userData: IUserDataWithFollowedStatusType;
}

export const ProfileContext = createContext<IProfileContext | null>(null);
