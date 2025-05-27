import UserList from '@/components/UserList';
import { useGetMyFriendsQuery, useGetUserFriendsQuery } from './querys';
import { useProfileContext } from '@/hooks/useProfileContext';

export default function FriendList() {
  const { isMe, userData } = useProfileContext();
  const myFriendsQuery = useGetMyFriendsQuery();
  const userFriendsQuery = useGetUserFriendsQuery({ userId: userData?.id });

  if (!userData) return null;

  return (
    <div>
      <UserList queryData={isMe ? myFriendsQuery : userFriendsQuery} />
    </div>
  );
}
