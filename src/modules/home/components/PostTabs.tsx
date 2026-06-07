import { PostList } from '@/components/Posts';
import { FirstPost } from '@/components/Posts/PostList';
import { useGetFollowingPosts, useGetPosts } from '@/components/Posts/querys';
import { usePostSocket } from '@/hooks/usePostSocket';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { Tabs, Tab } from '@heroui/tabs';

export default function PostTabs() {
  const { user } = useAppSelector(selectAuth);
  const query = useGetPosts({ likeUserId: user?.id });

  const followingQuery = useGetFollowingPosts({ likeUserId: user?.id });
  // Use the socket hook for posts
  usePostSocket();

  return (
    <>
      <Tabs className='block' aria-label='Tabs variants' variant='underlined' color='primary'>
        {/* For You Tab */}
        <Tab className='flex-1' key='for-you' title='For You'>
          <div className='space-y-5'>
            {/* First Post */}
            {query.data && query.data.pages[0]?.items.length > 0 && <FirstPost />}
            <PostList infinitePostData={query} skipFirstPost={true} />
          </div>
        </Tab>
        {/* Following Tab */}
        <Tab className='flex-1' key='following' title='Following'>
          <PostList infinitePostData={followingQuery} />
        </Tab>
      </Tabs>
    </>
  );
}
