import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { AlignLeft, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const location = useLocation();
  const currentPath = location.pathname.replace(/^\/setting\//, '');

  return (
    <ContentWrapper className='w-full md:min-h-[calc(100vh-100px)] md:w-1/5'>
      {/* Seting sidebar itmes */}
      <div className='space-y-2 '>
        {settingList.map(({ icon, label, to }, i) => (
          <SettingSidebarItem
            key={i}
            to={to}
            label={label}
            icon={icon}
            isActive={currentPath === to}
          />
        ))}
      </div>
    </ContentWrapper>
  );
}

interface IProps {
  label: string;
  icon: React.ReactNode;
  to: string;
  className?: string;
  isActive?: boolean;
}

function SettingSidebarItem({ label, icon, to, className, isActive }: IProps) {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(to)}
      variant='ghost'
      className={cn(
        'flex items-center justify-start w-full p-4 rounded-sm gap-x-4 hover:bg-accent text-foreground/90 hover:text-foreground/90',
        className,
        {
          'bg-accent': isActive, // Nếu item đang active, đổi màu nền
        },
      )}
    >
      <span className='text-primary'>{icon}</span>
      {label}
    </Button>
  );
}
