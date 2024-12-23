// Import necessary icons and components
import { RefreshCw, UserRoundPlus } from 'lucide-react';
import ContentWrapper from './ContentWrapper';
import UserAvatar from '@/components/UserAvatar';

// NewUsers component to display list of new users
export default function NewUsers() {
  return (
    <ContentWrapper>
      {/* Header section with title and refresh button */}
      <div className='flex items-center mb-4 justify-between'>
        <h1 className='text-lg font-semibold'>New Users</h1>
        <button>
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Users list container */}
      <div className='space-y-6'>
        {/* Example of user item structure - To be mapped over users data */}
        <div className='flex cursor-pointer items-center'>
          <UserAvatar className='mr-[10px]' avatarUrl='' />
          <h1 className='text-muted-foreground hover:text-foreground duration-300 transition-colors font-semibold truncate whitespace-pre-line break-words line-clamp-1'>
            Nguyễn Quốc Thắng
          </h1>
          {/* Add friend button */}
          <button className='ml-auto'>
            <UserRoundPlus size={18} />
          </button>
        </div>
        <div className='flex cursor-pointer items-center'>
          <UserAvatar className='mr-[10px]' avatarUrl='' />
          <h1 className='text-muted-foreground hover:text-foreground duration-300 transition-colors font-semibold truncate whitespace-pre-line break-words line-clamp-1'>
            Nguyễn Phi Phu
          </h1>
          {/* Add friend button */}
          <button className='ml-auto'>
            <UserRoundPlus size={18} />
          </button>
        </div>
        <div className='flex cursor-pointer items-center'>
          <UserAvatar className='mr-[10px]' avatarUrl='' />
          <h1 className='text-muted-foreground hover:text-foreground duration-300 transition-colors font-semibold truncate whitespace-pre-line break-words line-clamp-1'>
            Yuki Dang
          </h1>
          {/* Add friend button */}
          <button className='ml-auto'>
            <UserRoundPlus size={18} />
          </button>
        </div>
      </div>
    </ContentWrapper>
  );
}
