import { Skeleton } from '@/components/ui/skeleton';

export default function LikedUsersSkeletons({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <LikedUsersSkeletonItem key={`liked-users-skeleton-${index}`} />
      ))}
    </>
  );
}

export function LikedUsersSkeletonItem() {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center flex-1 gap-2'>
        <Skeleton className='rounded-full size-10' />
        <Skeleton className='h-6 w-28' />
      </div>
      <Skeleton className='rounded-full size-10' />
    </div>
  );
}
