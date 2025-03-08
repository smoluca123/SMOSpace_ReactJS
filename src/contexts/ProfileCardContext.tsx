import { IUserDataType } from '@/lib/types/interfaces';
import { createContext } from 'react';

interface ProfileCardContextType {
  userData: IUserDataType;
}

export const ProfileCardContext = createContext<ProfileCardContextType | null>(null);
