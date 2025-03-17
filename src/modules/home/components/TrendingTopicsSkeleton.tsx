import { Skeleton } from '@/components/ui/skeleton';

export function TrendingTopicsSkeleton({ skeletonCount = 3 }: { skeletonCount?: number }) {
  return Array.from({ length: skeletonCount }, (_, i) => (
    <div key={Math.random() * i} className='flex items-center w-full gap-x-4'>
      <Skeleton className='rounded-sm size-7' />
      <div className='flex-1'>
        <Skeleton className='w-1/2 h-4 mb-1 ' />
        <Skeleton className='w-1/3 h-4 ' />
      </div>
    </div>
  ));
}
