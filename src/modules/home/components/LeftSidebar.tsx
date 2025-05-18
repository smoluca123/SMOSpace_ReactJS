import { Button } from '@/components/ui/button';
import { PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import {
  ArrowDownToLine,
  BookImage,
  ChevronDown,
  Clapperboard,
  Library,
  MessageSquareHeart,
} from 'lucide-react';

export default function LeftSidebar({ className }: PropsWithClassName) {
  return (
    <ContentWrapper
      className={cn('~min-w-[10rem]/[20rem] max-w-[20rem]  max-h-dvh sticky top-0', className)}
    >
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
    <div className='space-y-4'>
      <Button
        variant='ghost'
        className='hover:bg-accent items-center flex gap-x-4 justify-start rounded-sm my-[5px] p-4 text-foreground/90 hover:text-foreground/90 w-full'
      >
        <MessageSquareHeart className='text-primary' />
        News Feed
        <ChevronDown className='ml-auto' />
      </Button>

      {/* menulist */}
      {menuItem.map(({ Icon, label }) => (
        <Button
          key={label}
          variant='ghost'
          className='flex gap-x-4 justify-start items-center p-4 w-full rounded-sm hover:bg-accent text-foreground/90 hover:text-foreground/90'
        >
          <Icon className='text-primary' />
          {label}
        </Button>
      ))}
    </div>
  );
}
