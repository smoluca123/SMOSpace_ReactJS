import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@radix-ui/react-separator';
import FriendRequestItem from '../components/FriendRequestItem';
import RefreshButton from '@/components/RefreshButton';

// component
export default function FriendsPage() {
  // auth check

  const haveFriendRequest = true;
  const pending = false;

  return (
    <section className='w-full px-2 lg:max-w-md xl:max-w-full'>
      <ContentWrapper>
        {/* title */}
        <div className='flex items-center justify-between w-full mb-2 '>
          <h1 className='text-2xl font-bold text-foreground'>Friend request </h1>

          <RefreshButton />
        </div>

        <Separator />

        {haveFriendRequest && !pending && (
          <>
            {/* Friend request  List */}
            <div className='space-y-4 '>
              {Array.from({ length: 5 }, (_, i) => (
                <>
                  <FriendRequestItem key={new Date().getTime()} />
                  {i < 4 && <Separator />}
                </>
              ))}
            </div>
          </>
        )}
        {!haveFriendRequest && !pending && <EmptyRequest />}
        {pending && <RequestLoader />}
      </ContentWrapper>
    </section>
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
