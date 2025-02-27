import { Loader2 } from 'lucide-react';
import NotificationItem from './NotificationItem';
import { Separator } from '../ui/separator';

export default function Notifications() {
  return (
    <div className='space-y-2 pl-4 pb-2 max-h-[500px] overflow-auto '>
      {Array.from({ length: 10 }, (_, i) => (
        <div className='space-y-2 ' key={i}>
          <NotificationItem />
          {i > 9 && <Separator />}
        </div>
      ))}
      <Loader2 className='mx-auto text-primary animate-spin' />
    </div>
  );
}
