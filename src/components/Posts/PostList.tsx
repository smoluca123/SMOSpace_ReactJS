import Post from '@/components/Posts/Post';
import { useGetPosts } from '@/components/Posts/querys';

export default function PostList() {
  const { data } = useGetPosts();
  return (
    <div className='space-y-6'>
      {data &&
        data.pages.map((page) => page.items.map((post) => <Post key={post.id} post={post} />))}
    </div>
  );
}
