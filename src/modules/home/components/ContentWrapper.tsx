import { PropsWithClassName, PropsWithStyle } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

interface IProps extends PropsWithClassName, PropsWithChildren, PropsWithStyle {}

export default function ContentWrapper({ children, className, style }: IProps) {
  return (
    <div
      className={cn('rounded-md ~p-4/5 content-wrapper overflow-hidden', className)}
      style={style}
    >
      {children}
    </div>
  );
}
