import UserAvatar from '@/components/UserAvatar';
import { Globe, GlobeLock } from 'lucide-react';

import parser from 'html-react-parser';
import { formatRelativeDate } from '@/lib/utils';
import LinkifyHashTag from '@/components/LinkifyHashTag';
import { Link } from 'react-router-dom';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import ProfileLink from '@/components/ProfileLink';
import { Separator } from '@/components/ui/separator';
import PostAction, { PostMoreButton } from '@/components/Posts/PostAction';
import { usePostContext } from '@/hooks/usePostContext';
import PostEngagementMetrics from '@/components/Posts/PostEngagementMetrics';

export default function Post() {
  const { post } = usePostContext();

  return (
    <ContentWrapper className=''>
      {post.id}
      <article className='space-y-3 shadow-sm group/post'>
        {/* Post Header */}
        <PostHeader />

        {/* Post Content */}
        <div className='break-words whitespace-pre-line'>
          <LinkifyHashTag>{parser(post.content)}</LinkifyHashTag>
        </div>

        {/* Post Engagement Metrics */}
        <PostEngagementMetrics />
      </article>
      <Separator className='my-2' />
      <PostAction />
    </ContentWrapper>
  );
}

function PostHeader() {
  const { post } = usePostContext();
  return (
    <div className='flex justify-between gap-3'>
      <div className='flex items-center gap-3'>
        {/* Post Author */}
        <ProfileLink username={post.author.username}>
          <UserAvatar avatarUrl={post.author.avatar} fallbackName={post.author.fullName} />
        </ProfileLink>
        <div className=''>
          {/* Post Author Name */}
          <ProfileLink username={post.author.username}>{post.author.fullName}</ProfileLink>

          <div className='flex items-center gap-2'>
            {/* Post Date */}
            <Link
              to={`/posts/${post.id}`}
              className='block text-sm text-muted-foreground hover:underline'
            >
              {formatRelativeDate(new Date(post.createdAt))}
            </Link>
            {/* Post Privacy Icon */}
            <PostPrivacyIcon isPrivate={post.isPrivate} />
          </div>
        </div>
      </div>

      {/* Post More Button */}
      <PostMoreButton className='' />
    </div>
  );
}

function PostPrivacyIcon({ isPrivate }: { isPrivate: boolean }) {
  return isPrivate ? <GlobeLock className='size-3' /> : <Globe className='size-3' />;
}
