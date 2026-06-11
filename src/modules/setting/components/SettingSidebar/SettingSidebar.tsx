import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { AlignLeft, History, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const settingList = [
  {
    label: 'Genneral',
    Icon: AlignLeft,
    to: '',
  },
  {
    label: 'Profile',
    Icon: User,
    to: 'profile',
  },
  {
    label: 'Call History',
    Icon: History,
    to: 'call-history',
  },
];


export default function SettingSidebar() {
  return (
    <ContentWrapper className='w-full  lg:min-h-[calc(100vh-100px)] lg:w-1/5'>
      {/* Seting sidebar itmes */}
      <div className='space-y-4'>
        {/* Setting List */}
        {settingList.map(({ Icon, label, to }, i) => (
          <NavLink
            key={Math.random() * i}
            to={to}
            className={({ isActive }) =>
              cn('text-foreground/90 block rounded-md', {
                'bg-accent text-primary': isActive,
              })
            }
            end
          >
            <Button
              key={label}
              variant='ghost'
              className='flex gap-x-4 justify-start items-center p-4 w-full rounded-sm hover:bg-accent'
            >
              <Icon className='text-primary' />
              {label}
            </Button>
          </NavLink>
        ))}
      </div>
    </ContentWrapper>
  );
}
