import { useGetUserInfomation } from '@/lib/querys';
import ProfileHeader from '@/modules/profile/components/Profile/ProfileHeader';
import ProfileProvider from '@/modules/profile/components/Profile/ProfileProvider';

interface IProps {
  username: string;
}

export default function Profile({ username }: IProps) {
  const { data: userData } = useGetUserInfomation({ userId: username });
  return (
    <div>
      {userData && (
        <ProfileProvider userData={userData}>
          <ProfileHeader />
        </ProfileProvider>
      )}
    </div>
  );
}
