import { Skeleton } from '@/components/ui/skeleton';

interface MessageSkeletonProps {
  isSender?: boolean;
  isGroup?: boolean;
}

function MessageSkeleton({ isSender = false, isGroup = false }: MessageSkeletonProps) {
  return (
    <div
      className={`flex items-start space-x-3 group ${
        isSender ? 'flex-row-reverse space-x-reverse' : ''
      }`}
    >
      {/* Avatar Skeleton */}
      <Skeleton className='flex-shrink-0 w-8 h-8 rounded-full' />

      <div
        className={`flex flex-col max-w-xs sm:max-w-md lg:max-w-lg ${
          isSender ? 'items-end' : 'items-start'
        }`}
      >
        {/* Sender name skeleton for group chats */}
        {isGroup && !isSender && <Skeleton className='w-16 h-3 mb-1' />}

        {/* Message bubble skeleton */}
        <div className={`rounded-2xl px-4 py-2 relative bg-muted/50`}>
          {/* Message content skeleton */}
          <div className='space-y-1'>
            <Skeleton className='w-32 h-4' />
            <Skeleton className='w-24 h-4' />
          </div>
        </div>

        {/* Timestamp and status skeleton */}
        <div className='flex items-center mt-1 space-x-2'>
          <Skeleton className='w-12 h-3' />
          {isSender && <Skeleton className='w-4 h-3' />}
        </div>
      </div>
    </div>
  );
}

export default function MessageSkeletons({ count = 5 }: { count?: number }) {
  return (
    <div className='flex-1 p-4 space-y-4'>
      {Array.from({ length: count }).map((_, index) => (
        <MessageSkeleton
          key={index}
          isSender={index % 3 === 0} // Mix of sender and receiver
          isGroup={true} // Assume group chat for variety
        />
      ))}
    </div>
  );
}

export { MessageSkeleton };
