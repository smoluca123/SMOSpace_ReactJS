import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TrendingUp } from 'lucide-react';
import UserCard from '@/components/UserCard';
import { TrendingTopics } from './TrendingTopics';
import NewUsers from './NewUsers';
import { cn } from '@/lib/utils';

interface IProps {
  className?: string;
}

/**
 * Renders the right-hand "discover" panel as a Sheet that slides in from the right.
 * The trigger is meant to live in the Header on screens smaller than `lg`,
 * keeping the right sidebar reachable without a floating button.
 */
export default function RightSidebarDrawer({ className }: IProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type='button'
          aria-label='Open trending topics'
          className={cn('~p-2/4 rounded-md hover:bg-accent lg:hidden', className)}
        >
          <TrendingUp />
        </button>
      </SheetTrigger>

      <SheetContent side='right' className='p-0 w-full sm:max-w-sm flex flex-col gap-0'>
        <SheetHeader className='px-4 pt-6 pb-2'>
          <SheetTitle>Discover</SheetTitle>
        </SheetHeader>

        <div className='overflow-y-auto flex-1 p-4 space-y-6 scrollbar-hide'>
          <UserCard />
          <TrendingTopics />
          <NewUsers />
        </div>
      </SheetContent>
    </Sheet>
  );
}
