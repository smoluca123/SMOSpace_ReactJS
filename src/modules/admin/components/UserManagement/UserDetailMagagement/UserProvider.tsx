import { UserContext, IUserContext } from '@/contexts/UserContext';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import { PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren {
  userData: IUserDataWithFollowedStatusType;
}

export default function UserProvider({ children, userData }: IProps) {
  return (
    <UserContext.Provider value={{ userData } as IUserContext<IUserDataWithFollowedStatusType>}>
      {children}
    </UserContext.Provider>
  );
}
