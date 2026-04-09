import ProfileCard from '@/components/ProfileCard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { UUID } from 'crypto';
import { PropsWithChildren, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface BaseProps extends PropsWithChildren, PropsWithClassName {
  username: string;
}

// Props when displayProfileCard=true
interface WithProfileCardProps extends BaseProps {
  userId: UUID; // userId is required when displayProfileCard=true
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

export function ProfileLinkWithCard({
  children,
  userId,
  username,
  className,
}: WithProfileCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle mouse enter on trigger
  const handleMouseEnter = () => {
    // Clear any pending leave timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    // Set timeout to open after delay (like Facebook)
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 300); // 300ms delay before showing
  };

  // Handle mouse leave from trigger
  const handleMouseLeave = () => {
    // Clear hover timeout if user leaves before card appears
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Set timeout to close after delay
    leaveTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // 200ms delay before hiding
  };

  // Handle mouse enter on popover content
  const handleContentMouseEnter = () => {
    // Clear leave timeout when hovering over content
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  // Handle mouse leave from popover content
  const handleContentMouseLeave = () => {
    // Start close timeout when leaving content
    leaveTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        asChild
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn('', className)}
      >
        <div>
          <ProfileLink username={username}>{children}</ProfileLink>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className='w-auto p-0 text-base bg-transparent border-none shadow-none'
        sideOffset={5}
        onMouseEnter={handleContentMouseEnter}
        onMouseLeave={handleContentMouseLeave}
        // Prevent closing when clicking inside
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          // Check if click is inside a dropdown menu or other portal
          const isInsidePortal =
            target.closest('[role="menu"]') ||
            target.closest('[data-radix-popper-content-wrapper]');
          if (isInsidePortal) {
            e.preventDefault();
          }
        }}
      >
        <ProfileCard userId={userId} />
      </PopoverContent>
    </Popover>
  );
}
