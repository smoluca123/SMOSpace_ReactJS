import { cn } from '@/lib/utils';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { AlignLeft, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const settingList = [
  {
    label: 'Genneral',
    icon: <AlignLeft />,
    to: 'genneral',
  },
  {
    label: 'Profile',
    icon: <User />,
    to: 'profile',
  },
];

export default function SettingSidebar() {
  return (
    <ContentWrapper className='w-full  lg:min-h-[calc(100vh-100px)] lg:w-1/5'>
      {/* Seting sidebar itmes */}
      <div className='space-y-4 '>
        {/* Setting List */}
        {settingList.map(({ icon, label, to }, i) => (
          <NavLink
            key={Math.random() * i}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center font-semibold justify-start w-full p-4 rounded-sm gap-x-4 hover:bg-accent text-foreground/50 hover:text-foreground/90 duration-300 transition-colors ',
                {
                  'bg-accent text-foreground/90': isActive,
                },
              )
            }
          >
            <span className='text-primary'>{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>
    </ContentWrapper>
  );
}
