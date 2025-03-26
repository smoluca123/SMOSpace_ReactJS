import { Loader2 } from 'lucide-react';
import NotificationItem from './NotificationItem';

export default function Notifications() {
  return (
    <div>
      <div className='space-y-2 pl-4 pb-2 max-h-[500px] overflow-auto '>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            className='pb-2 space-y-2 border-b last:border-none last:pb-0'
            key={Math.random() * i}
          >
            <NotificationItem />
          </div>
        ))}
      </div>

      {/* Loading */}
      <Loader2 className='mx-auto text-primary animate-spin' />
    </div>
  );
}
