import { PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

interface IProps extends PropsWithClassName, PropsWithChildren {}

export default function ContentWrapper({ children, className }: IProps) {
  return (
    <div className={cn('rounded-md p-4 bg-card', className)}>{children}</div>
  );
}
