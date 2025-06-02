import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Archive, Bookmark } from 'lucide-react';
import usePostsManagementContext from '@/hooks/usePostsManagementContext';
import parse from 'html-react-parser';
import PostsFilterAndTabs from '../PostsFilterAndTabs';
import EmptyFilteredPosts from './EmptyFilteredPosts';
import PostsTableLoadingSkeleton from './PostsTableLoadingSkeleton';
import PostsTableContent from './PostsTableContent';

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
              <PostsTableContent
                sortedPosts={sortedPosts}
                setIsEditDialogOpen={setIsEditDialogOpen}
                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              />
            ) : (
              <EmptyFilteredPosts />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
