import { CommentPost } from '@/components/Posts/PostAction/Actions/Comment';
import LikePost from '@/components/Posts/PostAction/Actions/LikePost';
import BookmarkPost from '@/components/Posts/PostAction/Actions/BookmarkPost';
import { SharePost } from '@/components/Posts/PostAction/Actions/Share';

export default function PostAction() {
  return (
    <div className='flex items-center justify-between'>
      <LikePost />

      <CommentPost />

      <SharePost />

      <BookmarkPost />
    </div>
  );
}
