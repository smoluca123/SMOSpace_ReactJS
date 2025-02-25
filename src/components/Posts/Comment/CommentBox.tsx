import { CommentList } from '@/components/Posts/Comment/';
import { CommentInput } from '@/components/Posts/Comment/CommentActions/CreateComment/';

export default function CommentBox() {
  return (
    <div className='mt-4 space-y-5'>
      <CommentList />
      <CommentInput />
    </div>
  );
}
