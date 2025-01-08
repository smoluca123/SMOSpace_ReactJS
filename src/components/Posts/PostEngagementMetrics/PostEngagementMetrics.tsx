import { LikeCounter } from '@/components/Posts/PostEngagementMetrics';

export default function PostEngagementMetrics() {
  return (
    <div className='flex items-center justify-between gap-2'>
      {/* Like counter */}
      <LikeCounter />
    </div>
  );
}
