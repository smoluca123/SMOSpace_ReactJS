import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  IApiPaginationResponseWrapper,
  IUserDataWithFollowedStatusType,
} from '@/lib/types/interfaces';
import { UseQueryResult } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function UserPaginationControls({
  query,
}: {
  query: UseQueryResult<IApiPaginationResponseWrapper<IUserDataWithFollowedStatusType>, Error>;
}) {
  const [searchParam, setSearchParam] = useSearchParams();

  const { data } = query;
  if (!data) return null;

  const limit = searchParam.get('limit') || '10';

  const newPageSize =
    data.data.pageSize > data.data.totalCount ? data.data.totalCount : data.data.pageSize;

  const handleItemsPerPageChange = (newLimit: string) => {
    setSearchParam({ limit: newLimit, page: searchParam.get('page') || '1' });
  };

  const currentPage = parseInt(searchParam.get('page') || '1', 10);

  const handlePageChange = (newPage: number) => {
    setSearchParam({
      page: newPage.toString(),
      limit: limit,
    });
  };

  return (
    <div className='flex items-center justify-between px-2 py-4 border-t'>
      <div className='flex items-center space-x-2'>
        <p className='text-sm text-muted-foreground'>
          Showing {newPageSize} user{newPageSize > 1 ? 's' : ''} of {data.data.totalCount} users
        </p>
      </div>
      <div className='flex items-center space-x-6'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Rows per page</p>
          <Select value={limit} onValueChange={handleItemsPerPageChange}>
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
            {data.data.totalPage > 1 ? 's' : ''}
          </p>
          <div className='flex items-center space-x-1'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(data.data.currentPage - 2)}
              disabled={currentPage <= 2}
            >
              <ChevronsLeft className='w-4 h-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(data.data.currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className='w-4 h-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(data.data.currentPage + 1)}
              disabled={currentPage === data.data.totalPage}
            >
              <ChevronRight className='w-4 h-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(data.data.currentPage + 2)}
              disabled={currentPage >= data.data.totalPage - 1}
            >
              <ChevronsRight className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
