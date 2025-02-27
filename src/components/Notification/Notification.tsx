import RefreshButton from '../RefreshButton';
import { Loader2 } from 'lucide-react';
import Notifications from './Notifications';

export default function Notification() {
  const haveNotification = true;
  const pending = false;

  return (
    <div className='w-full '>
      {/* Notification header */}
      <NotificationHeader />

      {/* Notification contnet */}
      {pending && <NotificationLoader />}

      {/* Display notification list */}
      {haveNotification && !pending && <Notifications />}

      {/* Empty notification */}
      {!haveNotification && !pending && <EmptyNotification />}
    </div>
  );
}

// Sub-components

const NotificationHeader = () => {
  return (
    <div className='flex  border-b-[1px] border-border mb-3 px-4 py-[10px] items-center justify-between w-full '>
      <h1 className='text-lg font-bold '>Notifications</h1>
      <RefreshButton />
    </div>
  );
};

const NotificationLoader = () => {
  return (
    <div className='w-full my-2'>
      <Loader2 className='mx-auto animate-spin text-primary' />
    </div>
  );
};

const EmptyNotification = () => {
  return (
    <>
      {/* don't have request */}
      <div className='text-center '>
        <h1 className='my-5 text-xl font-semibold text-muted-foreground'>
          You don{"'"}t have any notifications !
        </h1>
      </div>
    </>
  );
};
