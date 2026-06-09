import PostList from '@/components/Posts/PostList';
import { Hash } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useGetHashtagPosts } from '@/modules/hashtag/querys';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { UUID } from 'crypto';

export default function HashtagPage() {
  const { tag = '' } = useParams();
  const { user } = useAppSelector(selectAuth);

  // The route param may arrive with or without a leading '#'.
  const normalizedTag = tag.replace(/^#/, '');

  const infinitePostData = useGetHashtagPosts({
    tag: normalizedTag,
    likeUserId: user?.id as UUID | undefined,
  });

  const total = infinitePostData.data?.pages[0]?.totalCount ?? 0;

  return (
    <main className='overflow-hidden flex-1'>
      <div className='flex-auto space-y-6'>
        {/* Hashtag header */}
        <div className='flex gap-3 items-center p-4 rounded-xl border bg-card'>
          <div className='flex justify-center items-center w-12 h-12 rounded-full bg-primary/10'>
            <Hash className='w-6 h-6 text-primary' />
          </div>
          <div>
            <h1 className='text-xl font-semibold break-all'>#{normalizedTag}</h1>
            {!infinitePostData.isLoading && (
              <p className='text-sm text-muted-foreground'>
                {total} {total === 1 ? 'post' : 'posts'}
              </p>
            )}
          </div>
        </div>

        <PostList infinitePostData={infinitePostData} />
      </div>
    </main>
  );
}
