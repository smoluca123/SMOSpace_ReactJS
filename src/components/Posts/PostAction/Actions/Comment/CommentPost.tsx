import { Button } from '@/components/ui/button';
import { usePostContext } from '@/hooks/usePostContext';
import { MessageSquare } from 'lucide-react';

export default function CommentPost() {
  const { setDisplayCommentBox } = usePostContext();
  return (
    <Button variant='ghost' className='' onClick={() => setDisplayCommentBox((prev) => !prev)}>
      <MessageSquare className='size-4' />
      Comment
    </Button>
  );
}
