import { ProfileContext } from '@/contexts/ProfileContext';
import { IUserDataType } from '@/lib/types/interfaces';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

export default function ProfileProvider({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData: IUserDataType;
}) {
  const { user } = useAppSelector(selectAuth);
  const isMe = user?.id === userData.id;
  return <ProfileContext.Provider value={{ userData, isMe }}>{children}</ProfileContext.Provider>;
}
