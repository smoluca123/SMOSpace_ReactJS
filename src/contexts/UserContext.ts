import { IUserDataType } from '@/lib/types/interfaces';
import { createContext } from 'react';

export interface IUserContext<UserType = IUserDataType> {
  userData: UserType;
}

export const UserContext = createContext<IUserContext<IUserDataType> | null>(null);
