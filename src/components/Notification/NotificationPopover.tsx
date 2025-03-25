import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import Notification from './Notification';

export default function NotificationPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className='~p-2/4 rounded-md hover:bg-accent'>
          <Bell />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align='end'
        className=' border-border border p-0 w-screen  sm:w-[25rem]  max-w-lg '
      >
        <Notification />
      </PopoverContent>
    </Popover>
  );
}
