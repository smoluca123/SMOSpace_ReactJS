import React, { SetStateAction, useState } from 'react';
import { Button } from '@/components/ui/button';
import StatCard from '../components/StatCard';
import { StatItem } from '@/lib/types/interfaces';
import CreatePostDialog from '@/components/Posts/Editor/CreatePostDialog';
import PostsTable from '../components/PostsManagement/PostsTable';
import PostsManagementProvider from '../components/PostsManagement/PostsManagementProvider';
import { useGetPosts } from '@/components/Posts/querys';
import {
  Download,
  Clock,
  Plus,
  Upload,
  FileText,
  CheckCircle,
  Flag,
  Search,
  Filter,
  ChevronDown,
  Trash2,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import usePostsManagementContext from '@/hooks/usePostsManagementContext';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MultiplePostDeleteDialog from '../components/AdminActions/PostActions/MultiplePostDeleteDialog';
import DeletePostDialog from '../components/AdminActions/PostActions/DeletePostDialog';
import EditPostDialog from '../components/AdminActions/PostActions/EditPostDialog';

export default function PostsManagementPage() {
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const query = useGetPosts({});

  return (
    <PostsManagementProvider infinitePostData={query}>
      <div className='space-y-6'>
        {/* Page Header */}
        <PostsManagementHeader />

        {/* Enhanced Stats Cards */}
        <StatSection />

        {/* Enhanced Search and Filter */}
        <SearchSection
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          setIsBulkDeleteDialogOpen={setIsBulkDeleteDialogOpen}
        />

        {/* Filter Panel */}
        <FilterSection isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} />

        {/* Post List Section */}
        <PostsTable
          setIsEditDialogOpen={() => setOpenUpdateDialog(true)}
          setIsDeleteDialogOpen={() => setIsDeleteDialogOpen(true)}
        />

        <MultiplePostDeleteDialog
          onClose={() => {
            setIsBulkDeleteDialogOpen(false);
          }}
          open={isBulkDeleteDialogOpen}
        />

        <DeletePostDialog onClose={() => setIsDeleteDialogOpen(false)} open={isDeleteDialogOpen} />

        <EditPostDialog onClose={() => setIsDeleteDialogOpen(false)} open={openUpdateDialog} />
      </div>
    </PostsManagementProvider>
  );
}

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

const StatSection = () => {
  const stats: StatItem[] = [
    {
      title: 'Total Posts',
      value: '123',
      change: '+12%',
      trend: 'up',
      icon: FileText,
      description: 'Total number of posts',
    },
    {
      title: 'Published',
      value: '52',
      change: '+5%',
      trend: 'up',
      icon: CheckCircle,
      description: 'Published posts',
    },
    {
      title: 'Draft',
      value: '22',
      change: '-2%',
      trend: 'down',
      icon: Clock,
      description: 'Draft posts',
    },
    {
      title: 'Flagged',
      value: '25',
      change: '+1%',
      trend: 'up',
      icon: Flag,
      description: 'Flagged posts',
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

const SearchSection = ({
  isFilterOpen,
  setIsFilterOpen,
  setIsBulkDeleteDialogOpen,
}: {
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<SetStateAction<boolean>>;
  setIsBulkDeleteDialogOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { selectedPosts, searchTerm, setSearchTerm } = usePostsManagementContext();

  return (
    <div className='flex flex-col gap-4 sm:flex-row'>
      <div className='relative flex-1'>
        <Search className='absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground' />
        <Input
          placeholder='Search posts by title, content, author or hashtags...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10 transition-colors bg-background/50 border-muted focus:border-primary'
        />
      </div>
      <div className='flex gap-2'>
        <Button
          variant={isFilterOpen ? 'default' : 'outline'}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className='flex items-center gap-2'
        >
          <Filter className='w-4 h-4' />
          <span>Filters</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
          />
        </Button>
        {selectedPosts.length > 0 && (
          <Button variant='destructive' onClick={() => setIsBulkDeleteDialogOpen(true)}>
            <Trash2 className='w-4 h-4 mr-2' />
            Delete ({selectedPosts.length})
          </Button>
        )}
      </div>
    </div>
  );
};

const FilterSection = ({
  isFilterOpen,
  setIsFilterOpen,
}: {
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { filters, setFilters, infinitePostData } = usePostsManagementContext();

  const posts = infinitePostData.data?.pages.flatMap((page) => page.items);

  return (
    isFilterOpen && (
      <Card className='p-4 duration-200 animate-in fade-in-0 zoom-in-95'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='font-medium'>Advanced Filters</h3>
          <Button variant='ghost' size='sm' onClick={() => setIsFilterOpen(false)}>
            <X className='w-4 h-4' />
          </Button>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          <div>
            <Label htmlFor='filter-status' className='block mb-2'>
              Status
            </Label>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger id='filter-status'>
                <SelectValue placeholder='All Statuses' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value='Public'>Published</SelectItem>
                <SelectItem value='private'>Privated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor='filter-author' className='block mb-2'>
              Author
            </Label>
            <Select
              value={filters.author}
              onValueChange={(value) => setFilters({ ...filters, author: value })}
            >
              <SelectTrigger id='filter-author'>
                <SelectValue placeholder='All Authors' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Authors</SelectItem>
                {Array.from(new Set(posts?.map((post) => post.author.fullName))).map((author) => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-end'>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => setFilters({ status: 'all', author: 'all' })}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>
    )
  );
};
