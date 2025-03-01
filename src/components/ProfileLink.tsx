import ProfileCard from '@/components/ProfileCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { UUID } from 'crypto';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

interface BaseProps extends PropsWithChildren, PropsWithClassName {
  username: string;
}

// Props khi displayProfileCard=true
interface WithProfileCardProps extends BaseProps {
  userId: UUID; // userId bắt buộc khi displayProfileCard=true
}

export default function ProfileLink({ children, className, username }: BaseProps) {
  return (
    <Link
      className={cn('block font-medium hover:underline text-foreground', className)}
      to={`/profile/${username}`}
    >
      {children}
    </Link>
  );
}

export function ProfileLinkWithCard({ children, userId, username }: WithProfileCardProps) {
  return (
    // <Popover>
    //   <PopoverTrigger>
    //     <ProfileLink username={username}>{children}</ProfileLink>
    //   </PopoverTrigger>
    //   <PopoverContent >
    //     <ProfileCard userId={userId} />
    //   </PopoverContent>
    // </Popover>
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger>
          <ProfileLink username={username}>{children}</ProfileLink>
        </TooltipTrigger>
        <TooltipContent className='p-0 text-base bg-transparent border-none shadow-none'>
          <ProfileCard userId={userId} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
