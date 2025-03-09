import { useGetUserInfomation } from '@/lib/querys';
import ProfileContent from '@/modules/profile/components/Profile/ProfileContent/ProfileContent';
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
          <div className='space-y-5'>
            <ProfileHeader />
            <ProfileContent />
          </div>
        </ProfileProvider>
      )}
    </div>
  );
}
