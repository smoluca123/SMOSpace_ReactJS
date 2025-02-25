import { CommentPost } from '@/components/Posts/PostAction/Actions/Comment';
import LikePost from '@/components/Posts/PostAction/Actions/LikePost';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';

export default function PostAction() {
  return (
    <div className='flex items-center justify-between'>
      <LikePost />

      <CommentPost />

      <Button variant='ghost' className=''>
        <Bookmark className='size-4' />
        Save
      </Button>
    </div>
  );
}
