import { Link } from 'react-router-dom';
import { Bell, Home, MessageCircleCode, UserPlus } from 'lucide-react';

// Components
import AppLogo from '@/components/AppLogo';
import SearchInput from '@/components/Header/SearchInput';
import { Button } from '@/components/ui/button';
import UserButton from '@/components/UserButton';

// Redux
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

// Sub-components
const LeftSection = () => (
  <div className='flex items-center justify-between w-[20rem]'>
    <AppLogo className='w-[11rem]' />
    <Link to='/' className='flex gap-x-2 items-center p-2 text-white rounded-md bg-primary'>
      <Home size={18} />
      <span className='text-sm'>Home</span>
    </Link>
  </div>
);

const ActionButtons = () => (
  <>
    <button className='p-4 rounded-md hover:bg-accent'>
      <UserPlus />
    </button>
    <button className='p-4 rounded-md hover:bg-accent'>
      <MessageCircleCode />
    </button>
    <button className='p-4 rounded-md hover:bg-accent'>
      <Bell />
    </button>
  </>
);

const AuthSection = () => {
  const { user } = useAppSelector(selectAuth);

  return (
    <>
      {user ? (
        <UserButton showName={true} />
      ) : (
        <Link to='/auth/login'>
          <Button className='text-foreground'>Join now!</Button>
        </Link>
      )}
    </>
  );
};

export default function Header() {
  return (
    <header className='h-[70px] bg-card sticky top-0 z-10 border-b border-border'>
      <div className='container flex gap-x-4 items-center mx-auto h-full'>
        <LeftSection />
        <SearchInput />

        <div className='flex gap-x-4 justify-between items-center'>
          <ActionButtons />
          <AuthSection />
        </div>
      </div>
    </header>
  );
}
