import UserAvatar from '@/components/UserAvatar';
import NameWithBadge from '@/components/NameWithBadge';
import NameWithVerifiedIcon from '@/components/NameWithVerifiedIcon';
import PostMedia from '@/components/Posts/PostMedia';
import { IPostDataType } from '@/lib/types/interfaces';
import { formatRelativeDate } from '@/lib/utils';
import parser from 'html-react-parser';
import { useNavigate } from 'react-router-dom';

/**
 * Compact, read-only rendering of the original post embedded inside a share.
 *
 * Intentionally lightweight: no action bar, no comment box, no nested share -
 * it only shows author, content (truncated) and media, and links to the full
 * post on click.
 */
export default function SharedPostEmbed({
  post,
  /** When true the embed is non-interactive (used inside the share dialog). */
  preview = false,
}: {
  post: IPostDataType;
  preview?: boolean;
}) {
  const navigate = useNavigate();
  const limit = Math.min(post.content.length, 280);
  const isTruncated = post.content.length > limit;
  const shortContent = post.content.slice(0, limit);

  const handleClick = () => {
    if (preview) return;
    navigate(`/post/${post.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={
        'overflow-hidden mt-2 rounded-lg border border-border' +
        (preview ? '' : ' cursor-pointer hover:bg-muted/40 transition-colors')
      }
    >
      <div className='p-3 space-y-2'>
        {/* Author */}
        <div className='flex items-center gap-2'>
          <UserAvatar
            avatarUrl={post.author.avatar}
            fallbackName={post.author.fullName}
            className='size-8'
          />
          <div className='leading-tight'>
            <NameWithBadge userData={post.author}>
              <NameWithVerifiedIcon isVerified={post.author.isVerified}>
                <span className='text-sm font-medium'>{post.author.fullName}</span>
              </NameWithVerifiedIcon>
            </NameWithBadge>
            <p className='text-xs text-muted-foreground'>
              {formatRelativeDate(new Date(post.createdAt))}
            </p>
          </div>
        </div>

        {/* Content */}
        {post.content && (
          <div className='text-sm break-words whitespace-pre-line'>
            {parser(isTruncated ? `${shortContent}...` : post.content)}
          </div>
        )}
      </div>

      {/* Media */}
      {post.media && post.media.length > 0 && <PostMedia media={post.media} />}
    </div>
  );
}
