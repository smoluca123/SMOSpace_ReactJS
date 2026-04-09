import ContentWrapper from './ContentWrapper';
import UserAvatar from '@/components/UserAvatar';
import NewUsersSkeleton from './NewUsersSkeleton';
import { useGetNewUsers } from '@/modules/home/components/querys';
import FollowButton from '@/components/FollowButton';
import ProfileLink from '@/components/ProfileLink';
import RefreshButton from '@/components/RefreshButton';

// Main component that displays a list of newly registered users
export default function NewUsers() {
  const { data, isFetching, isSuccess, refetch } = useGetNewUsers();

  // State to track if data is being fetched (temporary hardcoded value)

  return (
    <ContentWrapper>
      {/* Header section containing title and refresh button */}
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-lg font-semibold'>New Users</h1>
        {/* Button to refresh the list of new users */}
        <RefreshButton onClick={() => refetch()} isLoading={isFetching} hiddenLabel />
      </div>

      {/* Container for the list of users with vertical spacing */}
      <div className='space-y-6'>
        {/* Render user list when data is not being fetched */}
        {!isFetching && isSuccess && data && (
          <>
            {/* Individual user item with hover effects and layout */}
            {data.items.map((user) => (
              <ProfileLink username={user.username} key={user.id}>
                <div className='flex items-center justify-between p-2 transition-colors duration-300 rounded-md cursor-pointer hover:bg-accent'>
                  <div className='flex items-center'>
                    {/* User's avatar with margin spacing */}
                    <UserAvatar
                      className='mr-[10px]'
                      avatarUrl={user.avatar}
                      fallbackName={user.username}
                    />
                    <h1 className='font-semibold break-words truncate whitespace-pre-line transition-colors duration-300 text-muted-foreground hover:text-foreground line-clamp-1'>
                      {user.fullName}
                    </h1>
                  </div>
                  {/* User's name with text styling and truncation */}

                  {/* Add friend button positioned at the end */}
                  <FollowButton userId={user.id} />
                </div>
              </ProfileLink>
            ))}
          </>
        )}
        {/* Show loading skeleton while fetching data */}
        {isFetching && <NewUsersSkeleton />}
      </div>
    </ContentWrapper>
  );
}
