import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/UserAvatar';
import PostAction from '../PostAction';
import usePostsManagementContext from '@/hooks/usePostsManagementContext';
import { IPostDataType } from '@/lib/types/interfaces';
import { formatDate, formatDistanceToNow } from 'date-fns';
import PostStatusBadge from '../../PostStatusBadge';
import { Calendar, FileText, Heart, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import parse from 'html-react-parser';

interface PostsTableContentProps {
  setIsEditDialogOpen: (open: boolean) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  sortedPosts: IPostDataType[];
}

export default function PostsTableContent({ sortedPosts }: PostsTableContentProps) {
  const { setSelectedPosts, selectedPosts } = usePostsManagementContext();

  const handleSelectPost = (post: IPostDataType) => {
    setSelectedPosts((prev) => {
      if (prev.includes(post)) {
        return prev.filter((selectedPost) => selectedPost !== post);
      } else {
        return [...prev, post];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === sortedPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(sortedPosts.map((post) => post));
    }
  };

  return (
    <div className='overflow-hidden border-0 rounded-md'>
      <Table>
        <TableHeader className='bg-muted/50'>
          <TableRow className='border-b hover:bg-transparent'>
            <TableHead className='w-12'>
              <Checkbox
                checked={selectedPosts.length === sortedPosts.length && sortedPosts.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>

            <TableHead className='transition-colors cursor-pointer hover:bg-muted/50'>
              <div className='flex items-center space-x-2'>
                <span>Author</span>
              </div>
            </TableHead>
            <TableHead className='transition-colors cursor-pointer hover:bg-muted/50'>
              <div className='flex items-center space-x-2'>
                <span>Status</span>
              </div>
            </TableHead>
            <TableHead className='transition-colors cursor-pointer hover:bg-muted/50'>
              <div className='flex items-center space-x-2'>
                <span>Category</span>
              </div>
            </TableHead>
            <TableHead className='hidden transition-colors cursor-pointer lg:table-cell hover:bg-muted/50'>
              <div className='flex items-center space-x-2'>
                <span>Created</span>
              </div>
            </TableHead>
            <TableHead className='hidden lg:table-cell'>Reports</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPosts.map((post) => (
            <TableRow
              key={post.id}
              className={cn(
                'hover:bg-muted/50 transition-colors',
                selectedPosts.some((selectedPost) => selectedPost.id === post.id) && 'bg-muted/30',
              )}
            >
              <TableCell>
                <Checkbox
                  checked={selectedPosts.some((selectedPost) => selectedPost.id === post.id)}
                  onCheckedChange={() => handleSelectPost(post)}
                />
              </TableCell>
              <TableCell>
                <div className='max-w-[300px] flex items-center gap-3'>
                  {post?.media[0]?.url ? (
                    <div className='flex-shrink-0 w-12 h-12 overflow-hidden border rounded-md'>
                      <img
                        src={post.media[0].url}
                        alt='post-img'
                        className='object-cover w-full h-full'
                      />
                    </div>
                  ) : (
                    <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-md bg-muted'>
                      <FileText className='w-5 h-5 text-muted-foreground' />
                    </div>
                  )}
                  <div className='flex-1 min-w-0'>
                    <article className='text-sm truncate line-clamp-1 text-muted-foreground'>
                      {parse(post.content)}
                    </article>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center space-x-2'>
                  <UserAvatar avatarUrl={post.author.avatar} className=' size-8' />
                  <div>
                    <span className='text-sm font-medium text-foreground'>
                      {post.author.fullName}
                    </span>
                    <div className='text-xs text-muted-foreground'>
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <PostStatusBadge post={post} />
              </TableCell>
              <TableCell className='hidden md:table-cell'>
                <div className='flex items-center space-x-3 text-sm'>
                  <div className='flex items-center space-x-1 text-red-500'>
                    <Heart className='w-3 h-3' />
                    <span>{post.likeCount}</span>
                  </div>
                  <div className='flex items-center space-x-1 text-blue-500'>
                    <MessageSquare className='w-3 h-3' />
                    <span>{post.commentCount}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className='hidden lg:table-cell'>
                <div className='flex items-center space-x-1 text-sm text-muted-foreground'>
                  <Calendar className='w-3 h-3' />
                  <span>{formatDate(new Date(post.createdAt), 'dd-MM-yyyy')}</span>
                </div>
              </TableCell>
              <TableCell className='hidden lg:table-cell'>
                <Badge variant='destructive' className='text-xs'>
                  22
                </Badge>
              </TableCell>
              <TableCell className='text-right'>
                <PostAction post={post} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
