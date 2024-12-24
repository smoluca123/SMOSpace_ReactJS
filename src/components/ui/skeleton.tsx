import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  // return <div className={cn('rounded-md animate-pulse bg-primary/10', className)} {...props} />;
  return <div className={cn('rounded-md animate-pulse bg-secondary', className)} {...props} />;
}

export { Skeleton };
