import { CommentPost } from '@/components/Posts/PostAction/Actions/Comment';
import LikePost from '@/components/Posts/PostAction/Actions/LikePost';
import BookmarkPost from '@/components/Posts/PostAction/Actions/BookmarkPost';

export default function PostAction() {
  return (
    <div className='flex items-center justify-between'>
      <LikePost />

      <CommentPost />

      <BookmarkPost />
    </div>
  );
}
