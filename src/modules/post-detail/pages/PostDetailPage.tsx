import PostDetail from '@/modules/post-detail/components/PostDetail';
import { Navigate, useParams } from 'react-router-dom';
import { UUID } from 'crypto';
import { useEffect } from 'react';

export default function PostDetailPage() {
  const { postId } = useParams();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  if (!postId) {
    return <Navigate to='/' />;
  }

  return (
    <div className='flex-1'>
      <PostDetail postId={postId as UUID} />
    </div>
  );
}
