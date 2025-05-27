import RefreshButton from '@/components/RefreshButton';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import FriendRequestList from './FriendRequestList';
import { useGetMyFriendRequests } from '@/modules/friends/components/FriendRequests/querys';

export default function FriendsRequest() {
  const query = useGetMyFriendRequests();

  const { refetch, isFetching } = query;

  return (
    <ContentWrapper>
      {/* title */}
      <div className='flex justify-between items-center mb-2 w-full'>
        <h1 className='text-2xl font-bold text-foreground'>Friend request </h1>

        <RefreshButton isLoading={isFetching} onClick={() => refetch()} />
      </div>

      <FriendRequestList friendRequestsQuery={query} />
    </ContentWrapper>
  );
}
