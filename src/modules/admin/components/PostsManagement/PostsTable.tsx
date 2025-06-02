import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Archive,
  Bookmark,
  Heart,
  MessageSquare,
  Calendar,
  FileText,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import usePostsManagementContext from '@/hooks/usePostsManagementContext';
import parse from 'html-react-parser';
import { formatDate, formatDistanceToNow } from 'date-fns';
import PostStatusBadge from '../PostStatusBadge';
import { IPostDataType } from '@/lib/types/interfaces';
import PostAction from './PostAction';
import PostsTableLoadingSkeleton from './PostsTable/PostsTableLoadingSkeleton';
import PostsFilterAndTabs from './PostsFilterAndTabs';
import EmptyFilteredPosts from './PostsTable/EmptyFilteredPosts';

interface PostsTableProps {
  setIsEditDialogOpen: (open: boolean) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
}

export default function PostsTable({
  setIsEditDialogOpen,
  setIsDeleteDialogOpen,
}: PostsTableProps) {
  const {
    sortDirection,
    filters,
    sortField,
    activeTab,
    searchTerm,
    setActiveTab,
    infinitePostData,
    selectedPosts,
    setSelectedPosts,
    setSortDirection,
    setSortField,
  } = usePostsManagementContext();

  const posts = infinitePostData.data?.pages.flatMap((page) => page.items);

  const filteredPosts =
    posts?.filter((post) => {
      const parsedContent = parse(post.content)
        .toString()
        .replace(/<[^>]*>/g, '');

      const matchesSearch =
        parsedContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.fullName.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesTab = true;
      if (activeTab === 'public') matchesTab = !post.isPrivate;
      if (activeTab === 'private') matchesTab = post.isPrivate;

      let matchesFilters = true;
      if (filters.status !== 'all') {
        matchesFilters = filters.status === 'private' ? post.isPrivate : !post.isPrivate;
      }
      if (filters.author !== 'all') matchesFilters = post.author.fullName === filters.author;

      return matchesSearch && matchesTab && matchesFilters;
    }) || [];

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (!sortField) return 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let aValue: any = a[sortField as keyof typeof a];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let bValue: any = b[sortField as keyof typeof b];

    if (sortField === 'author') {
      aValue = a.author.fullName;
      bValue = b.author.fullName;
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <SortAsc className='w-4 h-4' />
    ) : (
      <SortDesc className='w-4 h-4' />
    );
  };

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
    <Tabs defaultValue='all' value={activeTab} onValueChange={setActiveTab} className='w-full'>
      <PostsFilterAndTabs />
      <TabsContent value={activeTab} className='mt-0'>
        <Card className='shadow-sm'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-xl'>Posts Database</CardTitle>
                <CardDescription className='text-muted-foreground'>
                  Showing {sortedPosts.length} of {infinitePostData.data?.pages[0].totalCount || 0}{' '}
                  posts
                </CardDescription>
              </div>
              {selectedPosts.length > 0 && (
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-muted-foreground'>
                    {selectedPosts.length} selected
                  </span>
                  <Button variant='outline' size='sm'>
                    <Archive className='w-4 h-4 mr-2' />
                    Archive
                  </Button>
                  <Button variant='outline' size='sm'>
                    <Bookmark className='w-4 h-4 mr-2' />
                    Feature
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className='p-0'>
            {infinitePostData.isLoading ? (
              <PostsTableLoadingSkeleton />
            ) : infinitePostData.data && sortedPosts.length > 0 ? (
              <div className='overflow-hidden border-0 rounded-md'>
                <Table>
                  <TableHeader className='bg-muted/50'>
                    <TableRow className='border-b hover:bg-transparent'>
                      <TableHead className='w-12'>
                        <Checkbox
                          checked={
                            selectedPosts.length === sortedPosts.length && sortedPosts.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead
                        className='transition-colors cursor-pointer hover:bg-muted/50'
                        onClick={() => handleSort('title')}
                      >
                        <div className='flex items-center space-x-2'>
                          <span>Post</span>
                          {getSortIcon('title')}
                        </div>
                      </TableHead>
                      <TableHead
                        className='transition-colors cursor-pointer hover:bg-muted/50'
                        onClick={() => handleSort('author')}
                      >
                        <div className='flex items-center space-x-2'>
                          <span>Author</span>
                          {getSortIcon('author')}
                        </div>
                      </TableHead>
                      <TableHead
                        className='transition-colors cursor-pointer hover:bg-muted/50'
                        onClick={() => handleSort('status')}
                      >
                        <div className='flex items-center space-x-2'>
                          <span>Status</span>
                          {getSortIcon('status')}
                        </div>
                      </TableHead>
                      <TableHead
                        className='transition-colors cursor-pointer hover:bg-muted/50'
                        onClick={() => handleSort('category')}
                      >
                        <div className='flex items-center space-x-2'>
                          <span>Category</span>
                          {getSortIcon('category')}
                        </div>
                      </TableHead>
                      <TableHead
                        className='hidden transition-colors cursor-pointer lg:table-cell hover:bg-muted/50'
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className='flex items-center space-x-2'>
                          <span>Created</span>
                          {getSortIcon('createdAt')}
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
                          selectedPosts.some((selectedPost) => selectedPost.id === post.id) &&
                            'bg-muted/30',
                        )}
                      >
                        <TableCell>
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
                          <PostAction
                            post={post}
                            setIsEditDialogOpen={setIsEditDialogOpen}
                            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className='flex justify-center py-4'>
                  <Button
                    disabled={!infinitePostData.hasNextPage}
                    onClick={() => infinitePostData.fetchNextPage()}
                    className='px-4 py-2 font-semibold text-white transition duration-300 ease-in-out bg-blue-500 rounded-full shadow-md hover:bg-blue-600'
                  >
                    Load More Users
                  </Button>
                </div>
              </div>
            ) : (
              <EmptyFilteredPosts />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
