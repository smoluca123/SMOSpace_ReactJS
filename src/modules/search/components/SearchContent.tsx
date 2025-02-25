'use client';

import { PostList } from '@/components/Posts';
import { useGetPosts } from '@/components/Posts/querys';
import { useSearchParams } from 'react-router-dom';
export default function SearchContent() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const query = useGetPosts({ keywords: searchQuery || '' });
  return (
    <div className='flex-1 overflow-hidden'>
      <PostList infinitePostData={query} />
    </div>
  );
}
