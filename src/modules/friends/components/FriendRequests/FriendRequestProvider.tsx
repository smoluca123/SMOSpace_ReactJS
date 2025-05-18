import { FriendRequestContext } from '@/contexts/FriendRequestContext';
import { IFriendRequestWithFriendDataType } from '@/lib/types/interfaces';
import { PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren {
  friendRequest: IFriendRequestWithFriendDataType;
}

export default function FriendRequestProvider({ friendRequest, children }: IProps) {
  return (
    <FriendRequestContext.Provider value={{ friendRequest }}>
      {children}
    </FriendRequestContext.Provider>
  );
}
