import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { List } from 'lucide-react';
import UpdateUserInfomationForm from '../components/UpdateUserInfomationForm';

export default function GenneralSettingPage() {
  const { user } = useAppSelector(selectAuth);

  if (!user) return null;

  return (
    <section className='w-full space-y-5'>
      <GenneralSettingHeader />

      <ContentWrapper className='space-y-5 '>
        {/* Update User Infomation Form */}
        <UpdateUserInfomationForm />
      </ContentWrapper>
    </section>
  );
}

function GenneralSettingHeader() {
  return (
    <ContentWrapper className='flex items-center justify-between'>
      <h1 className='font-bold '>Genneral Setting</h1>
      <List />
    </ContentWrapper>
  );
}
