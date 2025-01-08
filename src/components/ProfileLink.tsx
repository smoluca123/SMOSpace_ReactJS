import { PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

interface IProps extends PropsWithChildren, PropsWithClassName {
  username: string;
}

export default function ProfileLink({ children, className, username }: IProps) {
  return (
    <Link
      className={cn('block font-medium hover:underline', className)}
      to={`/profile/${username}`}
    >
      {children}
    </Link>
  );
}
