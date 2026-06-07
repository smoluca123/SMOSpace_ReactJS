import { ProfileCardContext } from '@/contexts/ProfileCardContext';
import {
  IUserDataTypeWithFriendStatus,
  IUserDataWithFollowedStatusType,
} from '@/lib/types/interfaces';
import { PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren {
  userData: IUserDataWithFollowedStatusType & IUserDataTypeWithFriendStatus;
}

export default function ProfileCardProvider({ userData, children }: IProps) {
  return <ProfileCardContext.Provider value={{ userData }}>{children}</ProfileCardContext.Provider>;
}
