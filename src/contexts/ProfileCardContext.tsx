import {
  IUserDataTypeWithFriendStatus,
  IUserDataWithFollowedStatusType,
} from '@/lib/types/interfaces';
import { createContext } from 'react';

interface ProfileCardContextType {
  userData: IUserDataWithFollowedStatusType & IUserDataTypeWithFriendStatus;
}

export const ProfileCardContext = createContext<ProfileCardContextType | null>(null);
