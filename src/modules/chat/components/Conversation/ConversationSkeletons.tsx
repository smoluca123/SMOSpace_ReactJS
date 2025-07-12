import { Skeleton } from '@/components/ui/skeleton';

export default function ConversationSkeletons({ count = 10 }: { count?: number }) {
  return (
    <div className='flex flex-col gap-2'>
      {Array.from({ length: count }).map((_, index) => (
        <ConversationSkeleton key={index} />
      ))}
    </div>
  );
}

export function ConversationSkeleton() {
  return (
    <div className='flex gap-2 p-2 w-full'>
      <Skeleton className='flex-shrink-0 rounded-full size-10' />
      <div className='flex flex-col gap-2 w-full'>
        <Skeleton className='w-20 h-4' />
        <Skeleton className='w-full h-4' />
      </div>
    </div>
  );
}
