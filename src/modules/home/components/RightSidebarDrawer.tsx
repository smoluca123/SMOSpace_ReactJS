import { useState } from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import UserCard from '@/components/UserCard';
import { TrendingTopics } from './TrendingTopics';
import NewUsers from './NewUsers';

export default function RightSidebarDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button - chỉ hiện trên mobile/tablet */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            size='icon'
            className='fixed bottom-6 right-6 z-50 lg:hidden h-14 w-14 rounded-full shadow-lg'
            aria-label='Open trending topics'
          >
            <TrendingUp className='h-6 w-6' />
          </Button>
        </DrawerTrigger>

        <DrawerContent className='max-h-[85vh]'>
          <div className='overflow-y-auto p-4 space-y-6'>
            <UserCard />
            <TrendingTopics />
            <NewUsers />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
