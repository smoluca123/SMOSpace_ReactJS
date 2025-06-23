import { Skeleton } from '@/components/ui/skeleton';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

export function PostTableSkeleton() {
  // Create an array of 10 items to represent loading rows
  const loadingRows = Array.from({ length: 10 }, (_, i) => i);

  return (
    <TableBody className='w-full'>
      {loadingRows.map((index) => (
        <TableRow key={index}>
          {/* Checkbox Column Skeleton */}
          <TableCell className='py-3 w-[40px]'>
            <Skeleton className='w-4 h-4 bg-gray-700 rounded-full' />
          </TableCell>

          {/* Post Column Skeleton */}
          <TableCell className='py-3'>
            <div className='flex items-center gap-2'>
              <Skeleton className='w-5 h-5 bg-gray-700' />
              <Skeleton className='w-[180px] h-4 bg-gray-700' />
            </div>
          </TableCell>

          {/* Author Column Skeleton */}
          <TableCell className='py-3'>
            <div className='flex items-center gap-2'>
              <Skeleton className='w-8 h-8 bg-gray-700 rounded-full' />
              <div className='space-y-1'>
                <Skeleton className='w-[100px] h-4 bg-gray-700' />
                <Skeleton className='w-[80px] h-3 bg-gray-700' />
              </div>
            </div>
          </TableCell>

          {/* Status Column Skeleton */}
          <TableCell className='py-3'>
            <Skeleton className='w-[100px] h-6 bg-gray-700 rounded-full' />
          </TableCell>

          {/* Category Column Skeleton */}
          <TableCell className='py-3'>
            <Skeleton className='w-[80px] h-4 bg-gray-700' />
          </TableCell>

          {/* Created Date Column Skeleton */}
          <TableCell className='py-3'>
            <Skeleton className='w-[90px] h-4 bg-gray-700' />
          </TableCell>

          {/* Reports Column Skeleton */}
          <TableCell className='py-3'>
            <div className='flex justify-center'>
              <Skeleton className='w-6 h-6 bg-gray-700 rounded-full' />
            </div>
          </TableCell>

          {/* Actions Column Skeleton */}
          <TableCell className='py-3'>
            <div className='flex justify-end'>
              <Skeleton className='w-6 h-6 bg-gray-700 rounded-full' />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
