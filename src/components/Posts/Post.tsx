import UserAvatar from '@/components/UserAvatar';
import { Globe, GlobeLock } from 'lucide-react';

import parser from 'html-react-parser';
import { formatRelativeDate } from '@/lib/utils';
import LinkifyHashTag from '@/components/LinkifyHashTag';
import { Link } from 'react-router-dom';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import ProfileLink from '@/components/ProfileLink';
import { Separator } from '@/components/ui/separator';
import PostAction from '@/components/Posts/PostAction';
import { usePostContext } from '@/hooks/usePostContext';
import PostEngagementMetrics from '@/components/Posts/PostEngagementMetrics';

export default function Post() {
  const { post } = usePostContext();
  return (
    <ContentWrapper>
      {post.id}
      <article className='space-y-3 shadow-sm bg-card group/post'>
        <div className='flex justify-between gap-3'>
          <div className='flex gap-3 flex-warp'>
            <ProfileLink username={post.author.username}>
              <UserAvatar avatarUrl={post.author.avatar} fallbackName={post.author.fullName} />
            </ProfileLink>
            <div className=''>
              <ProfileLink username={post.author.username}>{post.author.fullName}</ProfileLink>
              <div className='flex items-center gap-2'>
                <Link
                  to={`/posts/${post.id}`}
                  className='block text-sm text-muted-foreground hover:underline'
                >
                  {formatRelativeDate(new Date(post.createdAt))}
                  {/* {post.createdAt.toString()} */}
                </Link>
                {post.isPrivate ? (
                  <div className='' title='Private'>
                    <GlobeLock className='size-3' />
                  </div>
                ) : (
                  <div className='' title='Public'>
                    <Globe className='size-3' />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* {user && user.id === post.userId && (
          <PostMoreButton
            post={post}
            className="transition-opacity opacity-0 group-hover/post:opacity-100"
          />
        )} */}
        </div>
        <div className='break-words whitespace-pre-line'>
          <LinkifyHashTag>{parser(post.content)}</LinkifyHashTag>
        </div>
        <PostEngagementMetrics />
      </article>
      <Separator className='my-2' />
      <PostAction />
    </ContentWrapper>
  );
}
