import { Skeleton } from '@/components/ui/skeleton';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

export function UserTableSkeleton() {
  // Create an array of 10 items to represent loading rows
  const loadingRows = Array.from({ length: 10 }, (_, i) => i);

  return (
    <TableBody className='w-full'>
      {loadingRows.map((index) => (
        <TableRow key={index} className='border-gray-700'>
          {/* User Column Skeleton */}
          <TableCell className='py-4'>
            <div className='flex items-center space-x-3'>
              <Skeleton className='w-8 h-8 bg-gray-700 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='w-24 h-4 bg-gray-700' />
                <Skeleton className='w-32 h-3 bg-gray-700' />
              </div>
            </div>
          </TableCell>

          {/* Status Column Skeleton */}
          <TableCell align='center'>
            <Skeleton className='w-16 h-6 bg-gray-700 rounded-full' />
          </TableCell>

          {/* Role Column Skeleton */}
          <TableCell align='center'>
            <div className='flex items-center justify-center space-x-2'>
              <Skeleton className='w-4 h-4 bg-gray-700' />
              <Skeleton className='w-16 h-4 bg-gray-700' />
            </div>
          </TableCell>

          {/* Posts Column Skeleton */}
          <TableCell align='center'>
            <Skeleton className='w-6 h-4 bg-gray-700' />
          </TableCell>

          {/* Followers Column Skeleton */}
          <TableCell align='center'>
            <Skeleton className='w-6 h-4 bg-gray-700' />
          </TableCell>

          {/* Join Date Column Skeleton */}
          <TableCell align='center'>
            <Skeleton className='w-20 h-4 bg-gray-700' />
          </TableCell>

          {/* Last Active Column Skeleton */}
          <TableCell align='center'>
            <Skeleton className='w-20 h-4 bg-gray-700' />
          </TableCell>

          {/* Actions Column Skeleton */}
          <TableCell align='center'>
            <Skeleton className='w-8 h-8 bg-gray-700 rounded-md' />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
