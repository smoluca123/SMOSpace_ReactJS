import { Button } from '@/components/ui/button';
import usePostsManagementContext from '@/hooks/usePostsManagementContext';
import { FileText } from 'lucide-react';

export default function EmptyFilteredPosts() {
  const { setFilters, setActiveTab, setSearchTerm } = usePostsManagementContext();

  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <div className='flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-muted'>
        <FileText className='w-10 h-10 text-muted-foreground' />
      </div>
      <h3 className='text-lg font-medium'>No posts found</h3>
      <p className='max-w-md mt-1 text-muted-foreground'>
        No posts match your current filters. Try adjusting your search or filters to find what
        you're looking for.
      </p>
      <Button
        variant='outline'
        className='mt-4'
        onClick={() => {
          setSearchTerm('');
          setActiveTab('all');
          setFilters({
            status: 'all',
            author: 'all',
          });
        }}
      >
        Reset All Filters
      </Button>
    </div>
  );
}
