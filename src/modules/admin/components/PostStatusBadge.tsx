import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle } from 'lucide-react';
import { IPostDataType } from '@/lib/types/interfaces';

export default function PostStatusBadge({ post }: { post: IPostDataType }) {
  if (post.isPrivate) {
    return (
      <Badge variant='secondary' className='flex items-center gap-1'>
        <Clock className='w-3 h-3' />
        <span>Draft</span>
      </Badge>
    );
  }

  return (
    <Badge className='flex items-center gap-1 text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300'>
      <CheckCircle className='w-3 h-3' />
      <span>Published</span>
    </Badge>
  );
}
