import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

export default function ProfileCardSkeleton() {
  return (
    <ContentWrapper className='w-screen max-w-md space-y-4 border rounded-md shadow-lg border-border'>
      <div className='w-full space-y-4 '>
        {/* Profile Header */}
        <ProfileHeaderSkeleton />

        <Separator />

        {/* Profile Content */}
        <ProfileContentSkeleton />
      </div>

      <Separator />

      {/* Profile Action */}
      <ProfileActionsSkeleton />
    </ContentWrapper>
  );
}

const ProfileHeaderSkeleton = () => {
  return (
    <div className='w-full space-y-4'>
      {/* Profile Header */}
      <div className='flex items-center gap-4'>
        {/* User avatar */}
        <Skeleton className='rounded-full size-10' />

        {/* Username */}
        <Skeleton className='w-1/2 h-4 rounded-md' />
      </div>
    </div>
  );
};

const ProfileContentSkeleton = () => {
  return (
    <div className='space-y-4 '>
      {/* Profile card metadata */}

      {Array.from({ length: 3 }, (_, i) => (
        <div key={Math.random() * i} className='flex items-center gap-x-4 '>
          <Skeleton className='rounded-sm size-5' />
          <Skeleton className='w-1/3 h-4 rounded-md' />
        </div>
      ))}
    </div>
  );
};

const ProfileActionsSkeleton = () => {
  return (
    <div className='flex justify-around w-full gap-x-2'>
      {/* Follow button */}
      <Skeleton className='w-1/2 rounded-2xl h-9' />

      {/* Message button */}
      <Skeleton className='flex-1 rounded-2xl h-9 ' />
    </div>
  );
};
