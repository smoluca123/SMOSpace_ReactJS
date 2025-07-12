import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IApiPaginationResponseWrapper, IPostDataType } from '@/lib/types/interfaces';
import { UseQueryResult } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function PostPaginationControls({
  query,
}: {
  query: UseQueryResult<IApiPaginationResponseWrapper<IPostDataType>, Error>;
}) {
  const [searchParam, setSearchParam] = useSearchParams();

  const { data } = query;
  if (!data) return null;

  const page = Number(searchParam.get('page')) || '1';
  const limit = Number(searchParam.get('limit')) || '10';

  const newPageSIze =
    data.data.pageSize > data.data.totalCount ? data.data.totalCount : data.data.pageSize;

  const handleItemsPerPageChange = (newLimit: string) => {
    setSearchParam({ page: '1', limit: newLimit });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParam({
      page: newPage.toString(),
      limit: searchParam.get('limit') || '10',
    });
  };

  return (
    <div className='flex items-center justify-between px-2 py-4 border-t'>
      <div className='flex items-center space-x-2'>
        <p className='text-sm text-muted-foreground'>
          Showing {newPageSIze} post of {data.data.totalCount} posts
        </p>
      </div>
      <div className='flex items-center space-x-6'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Rows per page</p>
          <Select value={limit.toString() || '10'} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent side='top'>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='50'>50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>
            Page {data.data.currentPage} of {data.data.totalPage} page
          </p>
          <div className='flex items-center space-x-1'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(1)}
              disabled={+page <= 2}
            >
              <ChevronsLeft className='w-4 h-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(data.data.currentPage - 1)}
              disabled={+page === 1}
            >
              <ChevronLeft className='w-4 h-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(data.data.currentPage + 1)}
              disabled={+page === data.data.totalPage}
            >
              <ChevronRight className='w-4 h-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(data.data.totalPage)}
              disabled={+page === data.data.totalPage}
            >
              <ChevronsRight className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
