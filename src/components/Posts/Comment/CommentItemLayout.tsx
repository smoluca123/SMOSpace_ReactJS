'use no memo';
import LinkifyHashTag from '@/components/LinkifyHashTag';
import MentionLinkHandler from '@/components/MentionLinkHandler';
import UserAvatar from '@/components/UserAvatar';
import useTimeDistance from '@/hooks/useTimeDistance';
import parse from 'html-react-parser';
import useCommentContext from '@/hooks/useCommentContext';
import ProfileLink from '@/components/ProfileLink';
import NameWithVerifiedIcon from '@/components/NameWithVerifiedIcon';
import CommentMoreButton from '@/components/Posts/Comment/CommentActions/CommentMoreButton';
import NameWithBadge from '@/components/NameWithBadge';

export default function CommentItemLayout() {
  const { comment, setIsShowReplyInput, isShowReplies, setIsShowReplies } = useCommentContext();
  const createdAt = useTimeDistance({ dateString: comment.createdAt });
  return (
    <div className=''>
      <div className='flex gap-2'>
        {/* User Avatar */}
        <UserAvatar avatarUrl={comment.author.avatar} fallbackName={comment.author.fullName} />
        {/* Comment Content */}
        <div className='space-y-2 w-full'>
          <div className='flex gap-2 items-center'>
            {/* Comment Content */}
            <div className='p-3 rounded-lg bg-muted w-fit'>
              <ProfileLink username={comment.author.username}>
                <NameWithBadge userData={comment.author}>
                  <NameWithVerifiedIcon isVerified={comment.author.isVerified}>
                    <p className='~text-sm font-medium'>{comment.author.fullName}</p>
                  </NameWithVerifiedIcon>
                </NameWithBadge>
              </ProfileLink>
              <MentionLinkHandler>
                <LinkifyHashTag>
                  <article className='~text-sm/base'>{parse(comment.content)}</article>
                </LinkifyHashTag>
              </MentionLinkHandler>
            </div>

            {/* Comment More Button */}
            <CommentMoreButton />
          </div>

          {/* Comment Actions */}
          <div className='flex gap-2 mt-1 text-sm'>
            {/* Comment Created At */}
            <p className='text-muted-foreground'>{createdAt}</p>

            {/* Comment Actions */}
            <button className='text-muted-foreground hover:text-primary'>Like</button>
            <button
              onClick={() => setIsShowReplyInput((prev) => !prev)}
              className='text-muted-foreground hover:text-primary'
            >
              Reply
            </button>
          </div>

          {/* Show Replies Button */}
          {comment.repliesCount > 0 && (
            <button
              onClick={() => setIsShowReplies((prev) => !prev)}
              className='text-sm text-muted-foreground hover:text-primary'
            >
              {isShowReplies ? 'Hide replies' : `Show all ${comment.repliesCount} replies`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
