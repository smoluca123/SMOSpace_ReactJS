import { Skeleton } from '@/components/ui/skeleton';

export default function NewUsersSkeleton({ skeletonCount = 3 }: { skeletonCount?: number }) {
  return Array.from({ length: skeletonCount }, (_, i) => (
    <div key={i} className='flex items-center'>
      <Skeleton className='mr-[10px] size-10 rounded-full' />
      <Skeleton className='w-[50%] h-5' />
      <Skeleton className=' ml-auto rounded-[8px] size-7' />
    </div>
  ));
}
