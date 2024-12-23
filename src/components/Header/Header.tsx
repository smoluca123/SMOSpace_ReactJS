import AppLogo from '@/components/AppLogo';
import SearchInput from '@/components/Header/SearchInput';
import UserButton from '@/components/UserButton';
import { Bell, Home, MessageCircleCode, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className='h-[70px] bg-card sticky top-0  z-10 border-b border-border'>
      <div className='container flex gap-x-4 items-center mx-auto h-full'>
        {/* Left side */}

        <div className='flex items-center justify-between w-[20rem] '>
          <AppLogo className='w-[11rem]' />

          <Link to='/' className='flex gap-x-2 items-center p-2 text-white rounded-md bg-primary'>
            <Home size={18} />
            <span className='text-sm'>Home</span>
          </Link>
        </div>
        <SearchInput />

        {/* Right left */}
        <div className='flex gap-x-4 justify-between items-center'>
          <button className='p-4 rounded-md hover:bg-accent'>
            <UserPlus />
          </button>
          <button className='p-4 rounded-md hover:bg-accent'>
            <MessageCircleCode />
          </button>
          <button className='p-4 rounded-md hover:bg-accent'>
            <Bell />
          </button>

          {/* {user && (
            <div className="flex items-center gap-x-4 max-w-[170px]">
              <UserAvatar username={user.username} avatarUrl={user.avatar} />
              <h4 className="truncate whitespace-pre-line break-words line-clamp-1">
                {user.fullName}
              </h4>
            </div>
          )} */}
          <UserButton showName={true} />
        </div>
      </div>
    </div>
  );
}
