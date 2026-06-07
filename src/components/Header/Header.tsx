import { Link } from 'react-router-dom';
import { Bookmark, Home, MessageCircleCode, UserPlus } from 'lucide-react';

// Components
import AppLogo from '@/components/AppLogo';
import UserButton from '@/components/UserButton';
import { NavSidebar } from '@/components/Header/NavSidebar';
import SearchBox from '@/components/Header/SearchBox';
import NotificationPopover from '@/components/Notification';
import { useGetUnreadChatCount } from '@/modules/chat/querys';
import RightSidebarDrawer from '@/modules/home/components/RightSidebarDrawer';

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

const ActionButtons = () => {
  const { data: unreadCount } = useGetUnreadChatCount();

  return (
    <div className='flex ~gap-x-0/2 justify-between items-center'>
      <Link to='/friends' className='~p-2/4 rounded-md hover:bg-accent'>
        <UserPlus />
      </Link>
      <Link to='/bookmarks' className='~p-2/4 rounded-md hover:bg-accent'>
        <Bookmark />
      </Link>
      <Link to='/chat' className='~p-2/4 relative rounded-md hover:bg-accent'>
        <MessageCircleCode />
        {!!unreadCount && unreadCount > 0 && (
          <span className='flex absolute -top-0.5 -right-0.5 justify-center items-center px-1 min-w-[18px] h-[18px] text-[10px] font-semibold leading-none text-white rounded-full bg-destructive'>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Link>
      {/* Right sidebar trigger – only visible below lg */}
      <RightSidebarDrawer />
      <NotificationPopover />
    </div>
  );
};

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
