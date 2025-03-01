import { PropsWithClassName, PropsWithStyle } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { forwardRef, PropsWithChildren } from 'react';

interface IProps extends PropsWithClassName, PropsWithChildren, PropsWithStyle {}

const ContentWrapper = forwardRef<HTMLDivElement, IProps>(({ children, className, style }, ref) => {
  return (
    <div
      className={cn('rounded-md ~p-4/5 content-wrapper overflow-hidden', className)}
      style={style}
      ref={ref}
    >
      {children}
    </div>
  );
});

ContentWrapper.displayName = 'ContentWrapper';

export default ContentWrapper;
