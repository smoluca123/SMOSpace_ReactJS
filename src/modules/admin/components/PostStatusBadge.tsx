import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock, Share2 } from 'lucide-react';
import { IPostDataType } from '@/lib/types/interfaces';

export default function PostStatusBadge({ post }: { post: IPostDataType }) {
  const isShare = !!post.sharedPostId;

  return (
    <div className='flex flex-wrap gap-1'>
      {post.isPrivate ? (
        <Badge variant='secondary' className='flex items-center gap-1'>
          <Lock className='w-3 h-3' />
          <span>Private</span>
        </Badge>
      ) : (
        <Badge className='flex items-center gap-1 text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300'>
          <CheckCircle className='w-3 h-3' />
          <span>Public</span>
        </Badge>
      )}
      {isShare && (
        <Badge variant='outline' className='flex items-center gap-1 text-xs text-blue-600 border-blue-300 dark:text-blue-400'>
          <Share2 className='w-3 h-3' />
          <span>Shared</span>
        </Badge>
      )}
    </div>
  );
}
