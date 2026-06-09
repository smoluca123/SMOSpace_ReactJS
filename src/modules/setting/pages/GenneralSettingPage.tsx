import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { List } from 'lucide-react';
import UpdateUserInfomationForm from '../components/UpdateUserInfomationForm';
import OnlineStatusSetting from '../components/OnlineStatusSetting';
import PushNotificationSetting from '../components/PushNotificationSetting';
import { Separator } from '@/components/ui/separator';

export default function GenneralSettingPage() {
  const { user } = useAppSelector(selectAuth);

  if (!user) return null;

  return (
    <section className='w-full space-y-5'>
      {/* Setting header */}
      <GenneralSettingHeader />

      <ContentWrapper className='space-y-5 '>
        {/* Update User Infomation Form */}
        <UpdateUserInfomationForm />
      </ContentWrapper>

      {/* Privacy */}
      <ContentWrapper className='space-y-4'>
        <h2 className='font-bold'>Privacy</h2>
        <Separator />
        <OnlineStatusSetting />
      </ContentWrapper>

      {/* Notifications */}
      <ContentWrapper className='space-y-4'>
        <h2 className='font-bold'>Notifications</h2>
        <Separator />
        <PushNotificationSetting />
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
