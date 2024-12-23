import UserAvatar from '@/components/UserAvatar';
import { Globe, GlobeLock } from 'lucide-react';

import parser from 'html-react-parser';
import { formatRelativeDate } from '@/lib/utils';
import LinkifyHashTag from '@/components/LinkifyHashTag';
import { IPostDataType } from '@/lib/types/interfaces';
import { Link } from 'react-router-dom';
import ContentWrapper from '@/modules/home/components/ContentWrapper';

interface IPostProps {
  post: IPostDataType;
}

export default function Post({ post }: IPostProps) {
  return (
    <ContentWrapper>
      <article className="space-y-3 shadow-sm bg-card group/post">
        <div className="flex gap-3 justify-between">
          <div className="flex gap-3 flex-warp">
            <Link to={`/users/${post.author.username}`}>
              <UserAvatar
                avatarUrl={post.author.avatar}
                fallbackName={post.author.fullName}
              />
            </Link>
            <div className="">
              <Link
                to={`/users/${post.author.username}`}
                className="block font-medium hover:underline"
              >
                {post.author.fullName}
              </Link>
              <div className="flex gap-2 items-center">
                <Link
                  to={`/posts/${post.id}`}
                  className="block text-sm text-muted-foreground hover:underline"
                >
                  {formatRelativeDate(new Date(post.createdAt))}
                  {/* {post.createdAt.toString()} */}
                </Link>
                {post.isPrivate ? (
                  <div className="" title="Private">
                    <GlobeLock className="size-3" />
                  </div>
                ) : (
                  <div className="" title="Public">
                    <Globe className="size-3" />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* {user && user.id === post.userId && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )} */}
        </div>
        <div className="whitespace-pre-line break-words">
          <LinkifyHashTag>{parser(post.content)}</LinkifyHashTag>
        </div>
      </article>
    </ContentWrapper>
  );
}
