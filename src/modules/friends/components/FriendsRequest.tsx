import RefreshButton from '@/components/RefreshButton';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import FriendRequestList from './FriendRequestList';

export default function FriendsRequest() {
  return (
    <ContentWrapper>
      {/* title */}
      <div className='flex items-center justify-between w-full mb-2 '>
        <h1 className='text-2xl font-bold text-foreground'>Friend request </h1>

        <RefreshButton />
      </div>

      <FriendRequestList />
    </ContentWrapper>
  );
}
