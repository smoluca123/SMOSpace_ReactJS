import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Calendar, FileText, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import usePostsManagementContext from '@/hooks/usePostsManagementContext';
import parse from 'html-react-parser';
import { formatDate, formatDistanceToNow } from 'date-fns';
import { IApiPaginationResponseWrapper, IPostDataType } from '@/lib/types/interfaces';
import { UseQueryResult } from '@tanstack/react-query';
import { SetStateAction } from 'react';
import PostsFilterAndTabs from '../PostsFilterAndTabs';
import PostStatusBadge from '../../PostStatusBadge';
import { PostTableSkeleton } from '../../Skeletons/PostTableSkeleton';
import PostPaginationControls from '../../PostPaginationControls';
import PostAction from '../PostAction';

interface PostsTableProps {
  query: UseQueryResult<IApiPaginationResponseWrapper<IPostDataType>, Error>;
  setIsBulkDeleteDialogOpen: React.Dispatch<SetStateAction<boolean>>;
}

function PostThumbnail({ url }: { url?: string }) {
  if (url) {
    return (
      <div className='flex-shrink-0 w-10 h-10 overflow-hidden border rounded-md'>
        <img src={url} alt='post thumbnail' className='object-cover w-full h-full' />
      </div>
    );
  }
  return (
    <div className='flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-md bg-muted'>
      <FileText className='w-4 h-4 text-muted-foreground' />
    </div>
  );
}

function PostEngagement({ likeCount, commentCount }: { likeCount: number; commentCount: number }) {
  return (
    <div className='flex items-center gap-3 text-sm'>
      <span className='flex items-center gap-1 text-red-500'>
        <Heart className='w-3 h-3' />
        {likeCount}
      </span>
      <span className='flex items-center gap-1 text-blue-500'>
        <MessageSquare className='w-3 h-3' />
        {commentCount}
      </span>
    </div>
  );
}

// Mobile card view for small screens
export function PostMobileCard({
  post,
  isSelected,
  onSelect,
}: {
  post: IPostDataType;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={cn(
        'flex gap-3 p-4 border-b transition-colors',
        isSelected && 'bg-muted/30',
      )}
    >
      <Checkbox checked={isSelected} onCheckedChange={onSelect} className='flex-shrink-0 mt-1' />
      <PostThumbnail url={post.media[0]?.url} />
      <div className='flex-1 min-w-0 space-y-1.5'>
        <article className='text-sm text-muted-foreground line-clamp-2'>
          {parse(post.content)}
        </article>
        <div className='flex items-center gap-2'>
          <UserAvatar avatarUrl={post.author.avatar} className='size-5' />
          <span className='text-xs font-medium truncate'>{post.author.fullName}</span>
        </div>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <PostStatusBadge post={post} />
            <PostEngagement likeCount={post.likeCount} commentCount={post.commentCount} />
          </div>
          <PostAction post={post} />
        </div>
        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
          <Calendar className='w-3 h-3' />
          {formatDate(new Date(post.createdAt), 'dd-MM-yyyy')}
        </div>
      </div>
    </div>
  );
}

export default function PostsTable({ query, setIsBulkDeleteDialogOpen }: PostsTableProps) {
  const { filters, activeTab, setActiveTab, selectedPosts, setSelectedPosts } =
    usePostsManagementContext();

  const { data, isLoading } = query;

  const filteredPosts =
    data?.data.items?.filter((post) => {
      const matchesTab =
        activeTab === 'public'
          ? !post.isPrivate
          : activeTab === 'private'
            ? post.isPrivate
            : true;

      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'private' ? post.isPrivate : !post.isPrivate);

      const matchesAuthor =
        filters.author === 'all' || post.author.fullName === filters.author;

      return matchesTab && matchesStatus && matchesAuthor;
    }) ?? [];

  const allSelected = selectedPosts.length === filteredPosts.length && filteredPosts.length > 0;

  const handleSelectPost = (post: IPostDataType) => {
    setSelectedPosts((prev) =>
      prev.includes(post) ? prev.filter((p) => p !== post) : [...prev, post],
    );
  };

  const handleSelectAll = () => {
    setSelectedPosts(allSelected ? [] : [...filteredPosts]);
  };

  return (
    <Tabs defaultValue='all' value={activeTab} onValueChange={setActiveTab} className='w-full '>
      <PostsFilterAndTabs />
      <TabsContent value={activeTab} className='mt-0'>
        <Card className='shadow-sm '>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between gap-4'>
              <CardTitle className='text-xl'>Posts Database</CardTitle>
              <div
                className={cn(
                  'flex items-center gap-3 transition-all duration-200',
                  selectedPosts.length === 0
                    ? 'opacity-0 pointer-events-none'
                    : 'opacity-100 pointer-events-auto',
                )}
              >
                <span className='text-sm text-muted-foreground whitespace-nowrap'>
                  {selectedPosts.length} selected
                </span>
                <Button
                  disabled={selectedPosts.length === 0}
                  onClick={() => setIsBulkDeleteDialogOpen(true)}
                  variant='destructive'
                  size='sm'
                >
                  <Trash2 className='w-4 h-4 mr-2' />
                  <span className='hidden sm:inline'>Delete All</span>
                  <span className='sm:hidden'>Delete</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className='p-0 '>
            {/* Mobile view (< md) */}
            {/* <div className='md:hidden'>
              {filteredPosts.map((post) => (
                <PostMobileCard
                  key={post.id}
                  post={post}
                  isSelected={selectedPosts.some((p) => p.id === post.id)}
                  onSelect={() => handleSelectPost(post)}
                />
              ))}
            </div> */}

            {/* Desktop view (>= md) */}
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader className='bg-muted/50'>
                  <TableRow className='border-b hover:bg-transparent'>
                    <TableHead className='w-12 px-5'>
                      <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
                    </TableHead>
                    <TableHead>Post</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead className='hidden lg:table-cell'>Created</TableHead>
                    <TableHead className='hidden lg:table-cell'>Reports</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow
                      key={post.id}
                      className={cn(
                        'hover:bg-muted/50 transition-colors',
                        selectedPosts.some((p) => p.id === post.id) && 'bg-muted/30',
                      )}
                    >
                      <TableCell className='px-5'>
                        <Checkbox
                          checked={selectedPosts.some((p) => p.id === post.id)}
                          onCheckedChange={() => handleSelectPost(post)}
                        />
                      </TableCell>

                      <TableCell>
                        <div className='flex items-center gap-3 max-w-[280px]'>
                          <PostThumbnail url={post.media[0]?.url} />
                          <article className='flex-1 min-w-0 text-sm line-clamp-2 text-muted-foreground'>
                            {parse(post.content)}
                          </article>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <UserAvatar avatarUrl={post.author.avatar} className='size-8' />
                          <div className='min-w-0'>
                            <p className='text-sm font-medium truncate'>{post.author.fullName}</p>
                            <p className='text-xs text-muted-foreground'>
                              {formatDistanceToNow(new Date(post.createdAt))} ago
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <PostStatusBadge post={post} />
                      </TableCell>

                      <TableCell>
                        <PostEngagement
                          likeCount={post.likeCount}
                          commentCount={post.commentCount}
                        />
                      </TableCell>

                      <TableCell className='hidden lg:table-cell'>
                        <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                          <Calendar className='w-3 h-3' />
                          {formatDate(new Date(post.createdAt), 'dd-MM-yyyy')}
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
                {isLoading && <PostTableSkeleton />}
              </Table>
            </div>

            <PostPaginationControls query={query} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
