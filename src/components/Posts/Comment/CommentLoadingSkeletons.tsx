import { Skeleton } from '@/components/ui/skeleton';

export default function CommentLoadingSkeletons({ count = 3 }: { count?: number }) {
  const randomWidth = () => {
    return Math.floor(Math.random() * 300) + 100;
  };
  const randomHeight = () => {
    return Math.floor(Math.random() * 60) + 60;
  };
  return (
    <div className='space-y-4'>
      {Array.from({ length: count }).map((_, index) => (
        <div className='flex gap-2' key={`loading-skeleton-${index}`}>
          <Skeleton className='rounded-full size-10' />
          <Skeleton
            style={{
              width: `${randomWidth()}px`,
              height: `${randomHeight()}px`,
            }}
            className='rounded-lg'
          />
        </div>
      ))}
    </div>
  );
}
