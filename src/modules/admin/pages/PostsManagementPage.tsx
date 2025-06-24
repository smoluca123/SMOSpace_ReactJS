import { useState } from 'react';
import { Button } from '@/components/ui/button';
import StatCard from '../components/StatCard';
import { IApiPaginationResponseWrapper, IPostDataType, StatItem } from '@/lib/types/interfaces';
import CreatePostDialog from '@/components/Posts/Editor/CreatePostDialog';
import PostsTable from '../components/PostsManagement/PostsTable';
import PostsManagementProvider from '../components/PostsManagement/PostsManagementProvider';
import { Download, Clock, Plus, Upload, FileText, CheckCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

import MultiplePostDeleteDialog from '../components/AdminActions/PostActions/MultiplePostDeleteDialog';
import { useGetAdminPostListQuery } from '../components/querys';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@uidotdev/usehooks';
import { UseQueryResult } from '@tanstack/react-query';

export default function PostsManagementPage() {
  return (
    <PostsManagementProvider>
      <PostsManagementSection />
    </PostsManagementProvider>
  );
}

const PostsManagementSection = () => {
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [searchParam, setSearchParam] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const query = useGetAdminPostListQuery({
    keywords: debouncedSearchTerm,
    page: parseInt(searchParam.get('page') || '1'),
    limit: parseInt(searchParam.get('limit') || '10'),
  });

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <PostsManagementHeader />

      {/* Enhanced Stats Cards */}
      <StatSection query={query} />

      {/* Enhanced Search and Filter */}
      <div className='relative flex-1'>
        <Search className='absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground' />
        <Input
          placeholder='Search posts by title, content, author or hashtags...'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSearchParam({
              page: '1',
              limit: searchParam.get('limit') || '10',
            });
          }}
          className='pl-10 transition-colors bg-background/50 border-muted focus:border-primary'
        />
      </div>

      {/* Post List Section */}
      <PostsTable setIsBulkDeleteDialogOpen={setIsBulkDeleteDialogOpen} query={query} />

      <MultiplePostDeleteDialog
        onClose={() => {
          setIsBulkDeleteDialogOpen(false);
        }}
        open={isBulkDeleteDialogOpen}
      />
    </div>
  );
};

const PostsManagementHeader = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Posts Management</h1>
        <p className='text-muted-foreground'>Manage and moderate all platform content</p>
      </div>
      <div className='flex items-center space-x-2'>
        <Button variant='outline' className='hidden md:flex'>
          <Download className='w-4 h-4 mr-2' />
          Export
        </Button>
        <Button variant='outline' className='hidden md:flex'>
          <Upload className='w-4 h-4 mr-2' />
          Import
        </Button>

        <Button onClick={() => setIsCreateDialogOpen(true)} className='shadow-sm'>
          <Plus className='w-4 h-4 mr-2' />
          Create Post
        </Button>

        <CreatePostDialog
          onClose={() => setIsCreateDialogOpen(false)}
          isOpen={isCreateDialogOpen}
        />
      </div>
    </div>
  );
};

const StatSection = ({
  query,
}: {
  query: UseQueryResult<IApiPaginationResponseWrapper<IPostDataType>, Error>;
}) => {
  const stats: StatItem[] = [
    {
      title: 'Total Posts',
      value: query.data?.data.totalCount.toString() || '0',
      change: '+12%',
      trend: 'up',
      icon: FileText,
      description: 'Total number of posts',
    },
    {
      title: 'Published',
      value: query?.data?.data?.items?.filter((post) => !post.isPrivate).length.toString() || '0',
      change: '+5%',
      trend: 'up',
      icon: CheckCircle,
      description: 'Published posts',
    },
    {
      title: 'Private',
      value: query?.data?.data?.items?.filter((post) => post.isPrivate).length.toString() || '0',
      change: '-2%',
      trend: 'down',
      icon: Clock,
      description: 'Draft posts',
    },
  ];

  return (
    <div className='grid gap-4 md:grid-cols-4'>
      {stats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </div>
  );
};
