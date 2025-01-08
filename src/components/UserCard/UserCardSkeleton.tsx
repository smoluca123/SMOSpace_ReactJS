import { Skeleton } from '@/components/ui/skeleton';
import ContentWrapper from '@/modules/home/components/ContentWrapper';

export default function UserCardSkeleton() {
  return (
    <ContentWrapper className='flex flex-col items-center justify-center space-y-4 text-center'>
      <Skeleton className='rounded-full size-32' />
      <Skeleton className='w-24 h-4' />
      <Skeleton className='w-24 h-4' />
      <Skeleton className='w-32 h-4' />
      <div className='flex items-center justify-center gap-2'>
        <Skeleton className='size-8' />
        <Skeleton className='size-8' />
        <Skeleton className='size-8' />
        <Skeleton className='size-8' />
        <Skeleton className='size-8' />
      </div>
    </ContentWrapper>
  );
}
