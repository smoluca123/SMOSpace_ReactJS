import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import noImagePlaceholder from '@/assets/imgs/logo.png';
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
import { Heart, MessageSquare, Calendar, FileText, Trash2, Share2, CornerDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import usePostsManagementContext from '@/hooks/usePostsManagementContext';
import parse from 'html-react-parser';
import { formatDate } from 'date-fns';
import { IApiPaginationResponseWrapper, IPostDataType } from '@/lib/types/interfaces';
import { UseQueryResult } from '@tanstack/react-query';
import { SetStateAction } from 'react';
import PostsFilterAndTabs from '../PostsFilterAndTabs';
import PostStatusBadge from '../../PostStatusBadge';
import { PostTableSkeleton } from '../../Skeletons/PostTableSkeleton';
import PaginationControls from '../../PaginationControls';
import PostAction from '../PostAction';

interface PostsTableProps {
  query: UseQueryResult<IApiPaginationResponseWrapper<IPostDataType>, Error>;
  setIsBulkDeleteDialogOpen: React.Dispatch<SetStateAction<boolean>>;
}

function PostThumbnail({ url }: { url?: string }) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = noImagePlaceholder;
    e.currentTarget.className = 'object-contain w-full h-full p-1 opacity-50';
  };

  if (url) {
    return (
      <div className='flex-shrink-0 w-10 h-10 overflow-hidden border rounded-md bg-muted'>
        <img
          src={url}
          alt='post thumbnail'
          className='object-cover w-full h-full'
          onError={handleError}
        />
      </div>
    );
  }
  return (
    <div className='flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-md bg-muted'>
      <FileText className='w-4 h-4 text-muted-foreground' />
    </div>
  );
}

function PostEngagement({ likeCount, commentCount, shareCount }: { likeCount: number; commentCount: number; shareCount?: number }) {
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
      {!!shareCount && (
        <span className='flex items-center gap-1 text-green-500'>
          <Share2 className='w-3 h-3' />
          {shareCount}
        </span>
      )}
    </div>
  );
}

/** Renders the Post cell content, handling normal posts and share/reposts */
function PostCellContent({ post }: { post: IPostDataType }) {
  const isShare = !!post.sharedPostId;
  const thumbnail = post.media[0]?.url ?? post.sharedPost?.media?.[0]?.url;

  return (
    <div className='flex items-start gap-3 max-w-[300px]'>
      <PostThumbnail url={thumbnail} />
      <div className='flex-1 min-w-0 space-y-1'>
        {/* Caption / post content */}
        {post.content ? (
          <article className='text-sm line-clamp-2 text-muted-foreground'>
            {parse(post.content)}
          </article>
        ) : isShare ? (
          <span className='text-xs italic text-muted-foreground'>No caption</span>
        ) : null}

        {/* Shared original post preview */}
        {isShare && post.sharedPost && (
          <div className='flex items-start gap-1.5 mt-1 pl-2 border-l-2 border-blue-300 dark:border-blue-700'>
            <CornerDownRight className='flex-shrink-0 w-3 h-3 mt-0.5 text-blue-400' />
            <div className='min-w-0'>
              <span className='text-xs font-medium text-blue-600 dark:text-blue-400'>
                @{post.sharedPost.author.username}
              </span>
              {post.sharedPost.content && (
                <article className='text-xs line-clamp-1 text-muted-foreground'>
                  {parse(post.sharedPost.content)}
                </article>
              )}
            </div>
          </div>
        )}

        {/* Shared post but original is deleted / unavailable */}
        {isShare && !post.sharedPost && (
          <div className='flex items-center gap-1.5 mt-1 pl-2 border-l-2 border-muted'>
            <CornerDownRight className='w-3 h-3 text-muted-foreground' />
            <span className='text-xs italic text-muted-foreground'>Original post unavailable</span>
          </div>
        )}
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
            : activeTab === 'shared'
              ? !!post.sharedPostId
              : true; // 'all'

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
              <div className='flex items-center gap-3'>
                <CardTitle className='text-xl'>Posts Database</CardTitle>
                {activeTab === 'shared' && (
                  <Badge variant='outline' className='flex items-center gap-1 text-blue-600 border-blue-300'>
                    <Share2 className='w-3 h-3' />
                    Share / Repost
                  </Badge>
                )}
              </div>
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

          <CardContent className='p-0'>
            {/* Desktop view */}
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
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow
                      key={post.id}
                      className={cn(
                        'hover:bg-muted/50 transition-colors align-top',
                        selectedPosts.some((p) => p.id === post.id) && 'bg-muted/30',
                        !!post.sharedPostId && 'border-l-2 border-l-blue-200 dark:border-l-blue-800',
                      )}
                    >
                      <TableCell className='px-5 pt-4'>
                        <Checkbox
                          checked={selectedPosts.some((p) => p.id === post.id)}
                          onCheckedChange={() => handleSelectPost(post)}
                        />
                      </TableCell>

                      <TableCell className='py-3'>
                        <PostCellContent post={post} />
                      </TableCell>

                      <TableCell className='py-3'>
                        <div className='flex items-center gap-2'>
                          <UserAvatar avatarUrl={post.author.avatar} className='size-8' />
                          <div className='min-w-0'>
                            <p className='text-sm font-medium truncate'>{post.author.fullName}</p>
                            <p className='text-xs text-muted-foreground'>
                              @{post.author.username}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className='py-3'>
                        <PostStatusBadge post={post} />
                      </TableCell>

                      <TableCell className='py-3'>
                        <PostEngagement
                          likeCount={post.likeCount}
                          commentCount={post.commentCount}
                          shareCount={post.shareCount}
                        />
                      </TableCell>

                      <TableCell className='hidden lg:table-cell py-3'>
                        <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                          <Calendar className='w-3 h-3' />
                          {formatDate(new Date(post.createdAt), 'dd-MM-yyyy')}
                        </div>
                      </TableCell>

                      <TableCell className='hidden lg:table-cell'>
                        <Badge variant='destructive' className='text-xs'>
                          0
                        </Badge>
                      </TableCell>

                      <TableCell className='text-right'>
                        <PostAction post={post} />
                      </TableCell>
                    </TableRow>
                  ))}

                  {!isLoading && filteredPosts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className='py-12 text-center text-muted-foreground'>
                        No posts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                {isLoading && <PostTableSkeleton />}
              </Table>
            </div>

            <PaginationControls query={query} entityLabel='posts' />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
