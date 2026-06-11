import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IPostDataType } from '@/lib/types/interfaces';
import { Clock, Eye, Heart, MessageSquare, MoreHorizontal, Share2, Loader2 } from 'lucide-react';
import parser from 'html-react-parser';
import UserAvatar from '@/components/UserAvatar';
import { formatRelativeDate } from '@/lib/utils';
import noImagePlaceholder from '@/assets/imgs/logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useGetAdminPostListQuery } from '../querys';

export default function RecentPosts() {
  const { data, isLoading } = useGetAdminPostListQuery({ page: 1, limit: 10, keywords: '' });

  const posts = data?.data.items ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2'>
          <MessageSquare className='w-5 h-5' />
          <span>Recent Posts</span>
        </CardTitle>
        <CardDescription>Latest content and engagement metrics</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='w-6 h-6 text-primary animate-spin' />
          </div>
        ) : posts.length === 0 ? (
          <div className='py-8 text-sm text-center text-muted-foreground'>No posts found.</div>
        ) : (
          <div className='space-y-4'>
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const PostItem = ({ post }: { post: IPostDataType }) => {
  const isShare = !!post.sharedPostId && !!post.sharedPost;

  return (
    <div className='relative group'>
      <Card className='transition-all duration-200 border-l-4 hover:shadow-md border-l-primary/20 hover:border-l-primary/60'>
        <CardContent className='p-4'>
          {/* Status and actions */}
          <div className='flex items-start justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <Badge
                className={
                  post.isPrivate
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                }
              >
                {post.isPrivate ? 'Private' : 'Public'}
              </Badge>
              {isShare && (
                <Badge variant='outline' className='flex items-center gap-1 text-xs'>
                  <Share2 className='w-3 h-3' />
                  Shared
                </Badge>
              )}
            </div>
            <PostItemDropdownMenu post={post} />
          </div>

          {/* Content with image */}
          <div className='flex gap-3 mb-3'>
            {post?.media[0] && (
              <div className='flex-shrink-0'>
                <img
                  src={post?.media[0]?.url}
                  alt='Post image'
                  className='object-cover w-20 h-20 border rounded-lg bg-muted'
                  onError={(e) => {
                    e.currentTarget.src = noImagePlaceholder;
                    e.currentTarget.className = 'object-contain w-20 h-20 border rounded-lg bg-muted p-2 opacity-50';
                  }}
                />
              </div>
            )}
            <div className='flex-1 min-w-0'>
              {/* Post content (caption of share or normal post) */}
              {post.content ? (
                <div className='text-sm leading-relaxed text-foreground line-clamp-3'>
                  {parser(post.content)}
                </div>
              ) : null}

              {/* Shared original post preview */}
              {isShare && post.sharedPost && (
                <div className='mt-2 p-2 rounded-md border bg-muted/50 text-xs text-muted-foreground line-clamp-2'>
                  <span className='font-medium text-foreground'>
                    @{post.sharedPost.author.username}:
                  </span>{' '}
                  {post.sharedPost.content ? parser(post.sharedPost.content) : (
                    <span className='italic'>No content</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Author and metadata */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <UserAvatar className='size-6' avatarUrl={post.author.avatar} />
              <span className='text-xs font-medium text-foreground'>{post.author.fullName}</span>
              <span className='text-xs text-muted-foreground'>•</span>
              <div className='flex items-center space-x-1 text-xs text-muted-foreground'>
                <Clock className='w-3 h-3' />
                <span>{formatRelativeDate(new Date(post.createdAt))}</span>
              </div>
            </div>

            {/* Engagement metrics */}
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-1 text-xs'>
                <Heart className='w-3 h-3 text-red-500' />
                <span className='text-muted-foreground'>{post.likeCount}</span>
              </div>
              <div className='flex items-center space-x-1 text-xs'>
                <MessageSquare className='w-3 h-3 text-blue-500' />
                <span className='text-muted-foreground'>{post.commentCount}</span>
              </div>
              {!!post.shareCount && (
                <div className='flex items-center space-x-1 text-xs'>
                  <Share2 className='w-3 h-3 text-green-500' />
                  <span className='text-muted-foreground'>{post.shareCount}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PostItemDropdownMenu = ({ post }: { post: IPostDataType }) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='w-8 h-8 p-0 transition-opacity opacity-0 group-hover:opacity-100'
        >
          <MoreHorizontal className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate('/post/' + post.id)}>
          <Eye className='w-4 h-4 mr-2' />
          View Post
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
