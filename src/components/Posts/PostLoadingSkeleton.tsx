import { Skeleton } from '@/components/ui/skeleton';

export default function PostsLoadingSkeleton() {
  return (
    <div className='space-y-5'>
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
    </div>
  );
}

export function PostLoadingSkeleton() {
  return (
    <div className='p-5 space-y-3 w-full rounded-2xl shadow-sm animate-pulse bg-card'>
      <div className='flex flex-wrap gap-3'>
        <Skeleton className='rounded-full size-12 bg-secondary' />
        <div className='space-y-1.5'>
          <Skeleton className='w-24 h-4 rounded bg-secondary' />
          <Skeleton className='w-20 h-4 rounded bg-secondarys' />
        </div>
      </div>
      <Skeleton className='h-16 rounded bg-secondary' />
    </div>
  );
}
