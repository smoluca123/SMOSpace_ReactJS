import { Skeleton } from '@/components/ui/skeleton';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

const SKELETON_ROWS = 10;

export function UserTableSkeleton() {
  return (
    <TableBody className='w-full'>
      {Array.from({ length: SKELETON_ROWS }, (_, i) => (
        <TableRow key={i}>
          {/* User */}
          <TableCell className='py-4'>
            <div className='flex items-center space-x-3'>
              <Skeleton className='w-8 h-8 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='w-24 h-4' />
                <Skeleton className='w-32 h-3' />
              </div>
            </div>
          </TableCell>

          {/* Status */}
          <TableCell align='center'>
            <Skeleton className='w-16 h-6 rounded-full' />
          </TableCell>

          {/* Role */}
          <TableCell align='center'>
            <div className='flex items-center justify-center space-x-2'>
              <Skeleton className='w-4 h-4' />
              <Skeleton className='w-16 h-4' />
            </div>
          </TableCell>

          {/* Posts */}
          <TableCell align='center'>
            <Skeleton className='w-6 h-4' />
          </TableCell>

          {/* Followers */}
          <TableCell align='center'>
            <Skeleton className='w-6 h-4' />
          </TableCell>

          {/* Join Date */}
          <TableCell align='center'>
            <Skeleton className='w-20 h-4' />
          </TableCell>

          {/* Last Active */}
          <TableCell align='center'>
            <Skeleton className='w-20 h-4' />
          </TableCell>

          {/* Actions */}
          <TableCell align='center'>
            <Skeleton className='w-8 h-8 rounded-md' />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
