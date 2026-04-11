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

  const page = Number(searchParam.get('page')) || 1;
  const limit = Number(searchParam.get('limit')) || 10;
  const { currentPage, totalPage, totalCount, pageSize } = data.data;

  const displayCount = Math.min(pageSize, totalCount);

  const handleLimitChange = (newLimit: string) => {
    setSearchParam({ limit: newLimit, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParam({ page: newPage.toString(), limit: limit.toString() });
  };

  return (
    <div className='flex flex-col gap-3 px-4 py-4 border-t sm:flex-row sm:items-center sm:justify-between'>
      {/* Showing info */}
      <p className='text-sm text-center text-muted-foreground sm:text-left'>
        Showing {displayCount} user{displayCount > 1 ? 's' : ''} of {totalCount} users
      </p>

      <div className='flex flex-col items-center gap-3 sm:flex-row sm:gap-6'>
        {/* Rows per page */}
        <div className='flex items-center gap-2'>
          <p className='text-sm font-medium whitespace-nowrap'>Rows per page</p>
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent side='top'>
              {['5', '10', '20', '50'].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page navigation */}
        <div className='flex items-center gap-2'>
          <p className='text-sm font-medium whitespace-nowrap'>
            Page {currentPage} of {totalPage} page{totalPage > 1 ? 's' : ''}
          </p>
          <div className='flex items-center gap-1'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(1)}
              disabled={page <= 1}
              aria-label='First page'
            >
              <ChevronsLeft className='w-4 h-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={page <= 1}
              aria-label='Previous page'
            >
              <ChevronLeft className='w-4 h-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={page >= totalPage}
              aria-label='Next page'
            >
              <ChevronRight className='w-4 h-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(totalPage)}
              disabled={page >= totalPage}
              aria-label='Last page'
            >
              <ChevronsRight className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
