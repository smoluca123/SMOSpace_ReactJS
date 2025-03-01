import { ProfileContext } from '@/contexts/ProfileContext';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';

export default function ProfileProvider({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData: IUserDataWithFollowedStatusType;
}) {
  return <ProfileContext.Provider value={{ userData }}>{children}</ProfileContext.Provider>;
}
