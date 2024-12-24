import { Skeleton } from '@/components/ui/skeleton';

export function TrendingTopicsSkeleton({ skeletonCount = 3 }: { skeletonCount?: number }) {
  return Array.from({ length: skeletonCount }, (_, i) => (
    <div key={i} className=' w-full  flex gap-x-4 items-center '>
      <Skeleton className='size-7   rounded-sm' />
      <div className='flex-1'>
        <Skeleton className='h-4 w-1/2 mb-1 ' />
        <Skeleton className='h-4 w-1/3 ' />
      </div>
    </div>
  ));
}
