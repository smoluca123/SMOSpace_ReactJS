import { Button } from '@/components/ui/button';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import {
  ArrowDownToLine,
  BookImage,
  ChevronDown,
  Clapperboard,
  Library,
  MessageSquareHeart,
} from 'lucide-react';

export default function LeftSidebar() {
  return (
    <ContentWrapper className=' ~min-w-[8rem]/[15rem] max-w-[20rem] hidden lg:block max-h-dvh sticky top-0'>
      <LeftSidebarMenu />
    </ContentWrapper>
  );
}

function LeftSidebarMenu() {
  const menuItem = [
    {
      label: 'Albums',
      Icon: Library,
    },
    {
      label: 'Reals',
      Icon: BookImage,
    },
    {
      label: 'Watch',
      Icon: Clapperboard,
    },
    {
      label: 'Saved Posts',
      Icon: ArrowDownToLine,
    },
  ];
  return (
    <div className=' space-y-4'>
      <Button
        variant='ghost'
        className='hover:bg-accent items-center flex gap-x-4 justify-start rounded-sm my-[5px] p-4 text-white/90 hover:text-white w-full'
      >
        <MessageSquareHeart className='text-primary' />
        News Feed
        <ChevronDown className='ml-auto ' />
      </Button>

      {/* menulist */}
      {menuItem.map(({ Icon, label }) => (
        <Button
          key={label}
          variant='ghost'
          className='hover:bg-accent items-center flex gap-x-4 justify-start  rounded-sm  p-4 text-white/90 hover:text-white w-full'
        >
          <Icon className='text-primary' />
          {label}
        </Button>
      ))}
    </div>
  );
}
