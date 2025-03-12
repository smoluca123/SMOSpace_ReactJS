import { useGetMyInfomation, useGetUserInfomation } from '@/lib/querys';
import ProfileContent from '@/modules/profile/components/Profile/ProfileContent/ProfileContent';
import ProfileHeader from '@/modules/profile/components/Profile/ProfileHeader';
import ProfileProvider from '@/modules/profile/components/Profile/ProfileProvider';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

interface IProps {
  username: string;
}

export default function Profile({ username }: IProps) {
  const { user } = useAppSelector(selectAuth);
  const isMe = user?.username === username;

  const { data: myUserData } = useGetMyInfomation({
    enabled: isMe,
  });

  const { data: userData } = useGetUserInfomation(
    { userId: username },
    {
      enabled: !isMe,
    },
  );

  const userDataInfomation = isMe ? myUserData : userData;
  return (
    <div>
      {userDataInfomation && (
        <ProfileProvider userData={userDataInfomation}>
          <div className='space-y-5'>
            <ProfileHeader />
            <ProfileContent />
          </div>
        </ProfileProvider>
      )}
    </div>
  );
}
