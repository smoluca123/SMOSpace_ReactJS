import { useGetNewUsers } from '@/modules/home/components/querys';
import RefreshButton from '@/components/RefreshButton';
import NewUsersSkeleton from '@/modules/home/components/NewUsersSkeleton';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import UserItem from '@/modules/home/components/NewUsers/UserItem';

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
              <UserItem key={user.id} user={user} />
            ))}
          </>
        )}
        {/* Show loading skeleton while fetching data */}
        {isFetching && <NewUsersSkeleton />}
      </div>
    </ContentWrapper>
  );
}
