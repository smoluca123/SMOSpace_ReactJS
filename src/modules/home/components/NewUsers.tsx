import { RefreshCw, UserRoundPlus } from 'lucide-react';
import ContentWrapper from './ContentWrapper';
import UserAvatar from '@/components/UserAvatar';
import NewUsersSkeleton from './NewUsersSkeleton';

// Main component that displays a list of newly registered users
export default function NewUsers() {
  // State to track if data is being fetched (temporary hardcoded value)
  const isFetching = false;

  return (
    <ContentWrapper>
      {/* Header section containing title and refresh button */}
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-lg font-semibold'>New Users</h1>
        {/* Button to refresh the list of new users */}
        <button>
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Container for the list of users with vertical spacing */}
      <div className='space-y-6'>
        {/* Render user list when data is not being fetched */}
        {!isFetching && (
          <>
            {/* Individual user item with hover effects and layout */}
            <div className='flex items-center p-2 transition-colors duration-300 rounded-md cursor-pointer hover:bg-accent'>
              {/* User's avatar with margin spacing */}
              <UserAvatar className='mr-[10px]' avatarUrl='' />
              {/* User's name with text styling and truncation */}
              <h1 className='font-semibold break-words truncate whitespace-pre-line transition-colors duration-300 text-muted-foreground hover:text-foreground line-clamp-1'>
                Nguyễn Quốc Thắng
              </h1>
              {/* Add friend button positioned at the end */}
              <button className='ml-auto'>
                <UserRoundPlus size={18} />
              </button>
            </div>
          </>
        )}
        {/* Show loading skeleton while fetching data */}
        {isFetching && <NewUsersSkeleton />}
      </div>
    </ContentWrapper>
  );
}
