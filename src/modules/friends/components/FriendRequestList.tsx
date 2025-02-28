import { Link } from 'react-router-dom';
import FriendRequestItem from './FriendRequestItem';
import { ChevronLeft, Loader2 } from 'lucide-react';

export default function FriendRequestList() {
  const haveFriendRequest = true;
  const pending = false;
  return (
    <div className=''>
      {/* Friend request  List */}
      {haveFriendRequest && !pending && (
        <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'>
          {Array.from({ length: 5 }, () => (
            <div className='pb-2 border-b last:border-none last:pb-0'>
              <FriendRequestItem key={new Date().getTime()} />
            </div>
          ))}
        </div>
      )}

      {!haveFriendRequest && !pending && <EmptyRequest />}
      {pending && <RequestLoader />}
    </div>
  );
}

// Sub-components
const RequestLoader = () => {
  return (
    <div className='w-full my-2'>
      <Loader2 className='mx-auto animate-spin text-primary' />
    </div>
  );
};

const EmptyRequest = () => {
  return (
    <>
      {/* don't have request */}
      <div className='text-center '>
        <h1 className='my-5 text-2xl font-bold text-muted-foreground'>
          You don{"'"}t have any friend request !
        </h1>
      </div>
      <Link className='flex ml-3 gap-x-2 text-primary' to={'/'}>
        <ChevronLeft />
        Return to home page
      </Link>
    </>
  );
};
