import { ProfileCardContext } from '@/contexts/ProfileCardContext';
import { IUserDataType } from '@/lib/types/interfaces';
import { PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren {
  userData: IUserDataType;
}

export default function ProfileCardProvider({ userData, children }: IProps) {
  return <ProfileCardContext.Provider value={{ userData }}>{children}</ProfileCardContext.Provider>;
}
