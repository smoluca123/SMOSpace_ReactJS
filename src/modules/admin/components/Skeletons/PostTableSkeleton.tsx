import { Skeleton } from '@/components/ui/skeleton';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

const SKELETON_ROWS = 10;

export function PostTableSkeleton() {
  return (
    <TableBody className='w-full'>
      {Array.from({ length: SKELETON_ROWS }, (_, i) => (
        <TableRow key={i}>
          {/* Checkbox */}
          <TableCell className='py-3 w-[40px]'>
            <Skeleton className='w-4 h-4 rounded-full' />
          </TableCell>

          {/* Post */}
          <TableCell className='py-3'>
            <div className='flex items-center gap-2'>
              <Skeleton className='w-5 h-5' />
              <Skeleton className='w-[180px] h-4' />
            </div>
          </TableCell>

          {/* Author */}
          <TableCell className='py-3'>
            <div className='flex items-center gap-2'>
              <Skeleton className='w-8 h-8 rounded-full' />
              <div className='space-y-1'>
                <Skeleton className='w-[100px] h-4' />
                <Skeleton className='w-[80px] h-3' />
              </div>
            </div>
          </TableCell>

          {/* Status */}
          <TableCell className='py-3'>
            <Skeleton className='w-[100px] h-6 rounded-full' />
          </TableCell>

          {/* Engagement */}
          <TableCell className='py-3'>
            <Skeleton className='w-[80px] h-4' />
          </TableCell>

          {/* Created Date */}
          <TableCell className='py-3'>
            <Skeleton className='w-[90px] h-4' />
          </TableCell>

          {/* Reports */}
          <TableCell className='py-3'>
            <div className='flex justify-center'>
              <Skeleton className='w-6 h-6 rounded-full' />
            </div>
          </TableCell>

          {/* Actions */}
          <TableCell className='py-3'>
            <div className='flex justify-end'>
              <Skeleton className='w-6 h-6 rounded-full' />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
