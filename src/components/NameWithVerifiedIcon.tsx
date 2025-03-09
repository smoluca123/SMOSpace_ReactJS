import VerifiedIcon from '@/components/VerifiedIcon';
import { PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren, PropsWithClassName {
  isVerified: boolean;
}

export default function NameWithVerifiedIcon({ children, className, isVerified }: IProps) {
  return (
    <div className={cn('flex gap-x-1 items-center', className)}>
      {children}
      <VerifiedIcon isVerified={isVerified} />
    </div>
  );
}
