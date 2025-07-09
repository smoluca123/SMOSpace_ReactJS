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
import { Heart, MessageSquare, Calendar, FileText, Delete } from 'lucide-react';
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

export default function PostsTable({
  query,
  setIsBulkDeleteDialogOpen,
}: {
  query: UseQueryResult<IApiPaginationResponseWrapper<IPostDataType>, Error>;
  setIsBulkDeleteDialogOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { filters, activeTab, setActiveTab, selectedPosts, setSelectedPosts } =
    usePostsManagementContext();

  const { data, isLoading } = query;

  const filteredPosts =
    data?.data.items?.filter((post) => {
      let matchesTab = true;
      if (activeTab === 'public') matchesTab = !post.isPrivate;
      if (activeTab === 'private') matchesTab = post.isPrivate;

      let matchesFilters = true;
      if (filters.status !== 'all') {
        matchesFilters = filters.status === 'private' ? post.isPrivate : !post.isPrivate;
      }
      if (filters.author !== 'all') matchesFilters = post.author.fullName === filters.author;

      return matchesTab && matchesFilters;
    }) || [];

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
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map((post) => post));
    }
  };

  return (
    <>
      <Tabs defaultValue='all' value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <PostsFilterAndTabs />
        <TabsContent value={activeTab} className='mt-0'>
          <Card className='shadow-sm'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <div className='flex gap-x-5'>
                  <CardTitle className='text-xl'>Posts Database</CardTitle>
                </div>
                <div
                  className={cn(
                    'flex items-center gap-4 transition-all duration-200',
                    selectedPosts.length === 0
                      ? 'opacity-0 pointer-events-none'
                      : 'opacity-100 pointer-events-auto',
                  )}
                >
                  <span className='text-sm text-muted-foreground'>
                    {selectedPosts.length} selected
                  </span>
                  <Button
                    disabled={selectedPosts.length == 0}
                    onClick={() => setIsBulkDeleteDialogOpen(true)}
                    variant='destructive'
                    size='sm'
                  >
                    <Delete className='w-4 h-4 mr-2' />
                    Delete All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className='p-0'>
              {
                <div className='overflow-hidden border-0 rounded-md'>
                  <Table>
                    <TableHeader className='bg-muted/50'>
                      <TableRow className='border-b hover:bg-transparent'>
                        <TableHead className='w-12  px-5'>
                          <Checkbox
                            checked={
                              selectedPosts.length === filteredPosts.length &&
                              filteredPosts.length > 0
                            }
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className='transition-colors cursor-pointer hover:bg-muted/50'>
                          <div className='flex items-center space-x-2'>
                            <span>Post</span>
                          </div>
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
                      {filteredPosts.map((post) => (
                        <TableRow
                          key={post.id}
                          className={cn(
                            'hover:bg-muted/50 transition-colors',
                            selectedPosts.some((selectedPost) => selectedPost.id === post.id) &&
                              'bg-muted/30',
                          )}
                        >
                          <TableCell className='px-4'>
                            <Checkbox
                              checked={selectedPosts.some(
                                (selectedPost) => selectedPost.id === post.id,
                              )}
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
                    {isLoading && <PostTableSkeleton />}
                  </Table>
                </div>
              }
              <PostPaginationControls query={query} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
