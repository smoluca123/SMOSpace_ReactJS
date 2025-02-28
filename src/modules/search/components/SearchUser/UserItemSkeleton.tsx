import { Skeleton } from '@/components/ui/skeleton';
import ContentWrapper from '@/modules/home/components/ContentWrapper';

export default function UserItemSkeleton() {
  return (
    <ContentWrapper className='~p-3/4  border border-border  flex gap-y-4 flex-col items-center justify-center rounded-md '>
      {/* Avatar */}
      <Skeleton className='rounded-full size-16' />

      {/* Full name */}
      <Skeleton className='w-1/2 h-4' />

      <div className='flex items-center w-full mt-5 text-sm text-center gap-x-2 text-muted-foreground'>
        <Skeleton className='w-1/2 h-3' />
        <Skeleton className='rounded-full size-2' />
        <Skeleton className='w-1/2 h-3' />
      </div>

      {/* Actions */}
      <Skeleton className='w-1/2 h-8' />
    </ContentWrapper>
  );
}
