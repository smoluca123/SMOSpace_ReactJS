import { Skeleton } from '@/components/ui/skeleton';

export function FollowingSkeletons({ length = 5 }: { length?: number }) {
  const emptyUsers = Array.from({ length });

  return (
    <div className='flex gap-2'>
      {emptyUsers.map((_, index) => (
        <Skeleton key={index} className='w-10 h-10 rounded-full animate-pulse' />
      ))}
    </div>
  );
}
