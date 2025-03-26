import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { User } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import UpdateUserDetailsForm from '../components/UpdateUserDetailsForm';

export default function ProfileSettingPage() {
  const { user } = useAppSelector(selectAuth);
  if (!user) return null;

  return (
    <section className='w-full max-w-full space-y-5 overflow-hidden'>
      {/* Setting header */}
      <ProfileSettingHeader />

      <ContentWrapper>
        <UpdateUserDetailsForm />
      </ContentWrapper>
    </section>
  );
}

function ProfileSettingHeader() {
  return (
    <ContentWrapper className='flex items-center justify-between '>
      <h1 className='font-bold '>Profile Setting</h1>
      <User />
    </ContentWrapper>
  );
}
