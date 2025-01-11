import { Link } from 'react-router-dom';
import { Bell, Home, MessageCircleCode, UserPlus } from 'lucide-react';

// Components
import AppLogo from '@/components/AppLogo';
import UserButton from '@/components/UserButton';
import { NavSidebar } from '@/components/Header/NavSidebar';
import SearchBox from '@/components/Header/SearchBox';

// Sub-components
const LeftSection = () => (
  <>
    <NavSidebar />
    <div className='flex items-center lg:justify-between lg:w-[20rem]'>
      <AppLogo className='w-[11rem] hidden lg:block' />
      <Link to='/' className='flex items-center p-2 text-white rounded-md gap-x-2 bg-primary'>
        <Home size={18} />
        <span className='hidden text-sm sm:inline-block'>Home</span>
      </Link>
    </div>
  </>
);

const ActionButtons = () => (
  <div className='flex ~gap-x-0/2 justify-between items-center'>
    <button className='~p-2/4 rounded-md hover:bg-accent'>
      <UserPlus />
    </button>
    <button className='~p-2/4 rounded-md hover:bg-accent'>
      <MessageCircleCode />
    </button>
    <button className='~p-2/4 rounded-md hover:bg-accent'>
      <Bell />
    </button>
  </div>
);

const AuthSection = () => {
  return <UserButton showName={true} />;
};

export default function Header() {
  return (
    <header className='h-[70px] content-wrapper sticky top-0 z-10 border-b border-border px-4 sm:px-0'>
      <div className='container flex justify-between items-center mx-auto h-full ~gap-x-2/4'>
        <LeftSection />
        <SearchBox />

        <ActionButtons />
        <AuthSection />
      </div>
    </header>
  );
}
