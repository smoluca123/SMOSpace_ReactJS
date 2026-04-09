import UserAvatar from '@/components/UserAvatar';
import { Globe, GlobeLock } from 'lucide-react';

import parser from 'html-react-parser';
import { formatRelativeDate } from '@/lib/utils';
import LinkifyHashTag from '@/components/LinkifyHashTag';
import MentionLinkHandler from '@/components/MentionLinkHandler';
import { Link } from 'react-router-dom';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { ProfileLinkWithCard } from '@/components/ProfileLink';
import { Separator } from '@/components/ui/separator';
import PostAction, { PostMoreButton } from '@/components/Posts/PostAction';
import { usePostContext } from '@/hooks/usePostContext';
import PostEngagementMetrics from '@/components/Posts/PostEngagementMetrics';
import NameWithVerifiedIcon from '@/components/NameWithVerifiedIcon';
import { CommentBox } from '@/components/Posts/Comment';
import NameWithBadge from '@/components/NameWithBadge';
import PostMedia from '@/components/Posts/PostMedia';

export default function Post({ isExpanded = false }: { isExpanded?: boolean }) {
  const { post, displayCommentBox } = usePostContext();
  const limit = Math.min(post.content.length, 500);
  const shortContent = post.content.slice(0, limit);

  return (
    <ContentWrapper className=''>
      {/* {post.id} */}
      <article className='space-y-3 shadow-sm group/post'>
        {/* Post Header */}
        <PostHeader />

        {/* Post Content */}
        <div className='whitespace-pre-line break-words'>
          <MentionLinkHandler>
            <LinkifyHashTag>
              {parser(
                isExpanded || post.content.length <= limit ? post.content : `${shortContent}...`,
              )}
              {!isExpanded && post.content.length > limit && (
                <Link
                  to={`/post/${post.id}`}
                  className='font-semibold text-primary hover:underline'
                >
                  Read More
                </Link>
              )}
            </LinkifyHashTag>
          </MentionLinkHandler>
        </div>
        <PostMedia media={post.media} />

        {/* Post Engagement Metrics */}
        <PostEngagementMetrics />
      </article>
      <Separator className='my-2' />
      <PostAction />

      {displayCommentBox && (
        <>
          <Separator className='my-2' />
          <CommentBox />
        </>
      )}
    </ContentWrapper>
  );
}

function PostHeader() {
  const { post } = usePostContext();
  return (
    <div className='flex gap-3 justify-between'>
      <div className='flex gap-3 items-center'>
        {/* Post Author */}
        <ProfileLinkWithCard username={post.author.username} userId={post.author.id}>
          <UserAvatar avatarUrl={post.author.avatar} fallbackName={post.author.fullName} />
        </ProfileLinkWithCard>
        <div className=''>
          {/* Post Author Name */}

          <ProfileLinkWithCard username={post.author.username} userId={post.author.id}>
            <NameWithBadge userData={post.author}>
              <NameWithVerifiedIcon isVerified={post.author.isVerified}>
                {post.author.fullName}
              </NameWithVerifiedIcon>
            </NameWithBadge>
          </ProfileLinkWithCard>

          <div className='flex gap-2 items-center'>
            {/* Post Date */}
            <Link
              to={`/post/${post.id}`}
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
