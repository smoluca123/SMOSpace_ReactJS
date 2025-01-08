import LikePost from '@/components/Posts/PostAction/Actions/LikePost';
import { Button } from '@/components/ui/button';
import { Bookmark, MessageSquare } from 'lucide-react';

export default function PostAction() {
  return (
    <div className='flex items-center justify-between'>
      <LikePost />
      <Button variant='ghost' className=''>
        <MessageSquare className='size-4' />
        Comment
      </Button>
      <Button variant='ghost' className=''>
        <Bookmark className='size-4' />
        Save
      </Button>
    </div>
  );
}
