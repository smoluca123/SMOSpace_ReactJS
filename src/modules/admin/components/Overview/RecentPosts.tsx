import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import { useGetPosts } from '@/components/Posts/querys';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IPostDataType } from '@/lib/types/interfaces';
import { Clock, Eye, Heart, MessageSquare, MoreHorizontal } from 'lucide-react';
import parser from 'html-react-parser';
import UserAvatar from '@/components/UserAvatar';
import { formatRelativeDate } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function RecentPosts() {
  const { data, hasNextPage, fetchNextPage } = useGetPosts({});

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
        <InfiniteScrollContainer
          isShowInViewElement={hasNextPage}
          onBottomReached={fetchNextPage}
          className='space-y-4'
        >
          {data?.pages.map((page) =>
            page.items.map((post) => <PostItem key={post.id} post={post} />),
          )}
        </InfiniteScrollContainer>
      </CardContent>
    </Card>
  );
}

const PostItem = ({ post }: { post: IPostDataType }) => {
  return (
    <div className='relative group'>
      <Card className='transition-all duration-200 border-l-4 hover:shadow-md border-l-primary/20 hover:border-l-primary/60'>
        <CardContent className='p-4'>
          {/* Status and actions */}
          <div className='flex items-start justify-between mb-3'>
            <Badge className='text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300'>
              Published
            </Badge>
            <PostItemDropdownMenu post={post} />
          </div>

          {/* Content with image */}
          <div className='flex gap-3 mb-3'>
            {post?.media[0] && (
              <div className='flex-shrink-0'>
                <img
                  src={post?.media[0]?.url}
                  alt='Post image'
                  className='object-cover w-20 h-20 border rounded-lg'
                />
              </div>
            )}
            <div className='flex-1 min-w-0 text-sm leading-relaxed text-foreground line-clamp-4 '>
              {parser(post.content)}
            </div>
          </div>

          {/* Author and metadata */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <UserAvatar className=' size-6' avatarUrl={post.author.avatar} />
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
