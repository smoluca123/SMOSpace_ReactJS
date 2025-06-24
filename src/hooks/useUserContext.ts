import { UserContext, IUserContext } from '@/contexts/UserContext';
import { IUserDataType } from '@/lib/types/interfaces';

import { useContext } from 'react';

export default function useUserContext<UserType = IUserDataType>() {
  const context = useContext(UserContext) as IUserContext<UserType> | null;

  if (!context) throw new Error('useUserContext must be used within a UserProvider');

  return context;
}
