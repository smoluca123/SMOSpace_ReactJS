import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import UserAvatar from '@/components/UserAvatar';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import UserAction from './UserAction';
import VerifiedIcon from '@/components/VerifiedIcon';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { formatDate } from 'date-fns';
import UserStatusBadge from '../UserStatusBadge';
import { cn } from '@/lib/utils';
import UserRoleBadge from '../UserRoleBadge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface UserTableProps {
  query: UseInfiniteQueryResult<
    InfiniteData<{
      items: IUserDataWithFollowedStatusType[];
      totalCount: number;
      totalPage: number;
      currentPage: number;
      pageSize: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }>,
    Error
  >;
  setSelectedUser: (user: IUserDataWithFollowedStatusType) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  filterStatus: 'all' | 'active' | 'inactive' | string;
}

export default function UsersTable({
  query,
  setSelectedUser,
  setIsEditDialogOpen,
  setIsDeleteDialogOpen,
  filterStatus,
}: UserTableProps) {
  const { data, fetchNextPage, hasNextPage, isPending } = query;

  const userFilter = (users: IUserDataWithFollowedStatusType[]) =>
    users.filter((user) => {
      if (filterStatus === 'all') return true;
      return (filterStatus.toLowerCase() === 'active') === user.isActive;
    });

  return (
    data && (
      <div className='overflow-hidden border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className='text-center'>Status</TableHead>
              <TableHead className='text-center '>Role</TableHead>
              <TableHead className='hidden text-center md:table-cell'>Posts</TableHead>
              <TableHead className='hidden text-center md:table-cell'>Followers</TableHead>
              <TableHead className='hidden lg:table-cell'>Join Date</TableHead>
              <TableHead className='hidden lg:table-cell'>Last Active</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pages.map((page) =>
              userFilter(page.items).map((user: IUserDataWithFollowedStatusType) => (
                <UserItem
                  setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                  setIsEditDialogOpen={setIsEditDialogOpen}
                  setSelectedUser={setSelectedUser}
                  user={user}
                  key={user.id}
                />
              )),
            )}
          </TableBody>
        </Table>

        <div className='flex justify-center py-4'>
          <Button
            disabled={!hasNextPage}
            onClick={() => fetchNextPage()}
            className='px-4 py-2 font-semibold text-white transition duration-300 ease-in-out rounded-full shadow-md '
          >
            Load More Users
          </Button>
          {isPending && <Loader2 className=' animate-spin' />}
        </div>
      </div>
    )
  );
}

const UserItem = ({
  user,
  setIsDeleteDialogOpen,
  setIsEditDialogOpen,
  setSelectedUser,
}: {
  user: IUserDataWithFollowedStatusType;
  setSelectedUser: (user: IUserDataWithFollowedStatusType) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}) => {
  return (
    <TableRow>
      <TableCell>
        <div className='flex items-center space-x-3'>
          <UserAvatar avatarUrl={user.avatar} />
          <div>
            <div
              className={cn('flex items-center space-x-2 font-medium text-foreground', {
                'text-destructive': user.isBanned,
              })}
            >
              <span>{user.fullName}</span>
              {user.isVerified && <VerifiedIcon isVerified />}
            </div>
            <div
              className={cn('text-sm text-muted-foreground', {
                'text-destructive': user.isBanned,
              })}
            >
              {user.email}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell align='center'>
        <UserStatusBadge user={user} />
      </TableCell>
      <TableCell align='center'>
        <UserRoleBadge role={user.userType.typeName} />
      </TableCell>
      <TableCell className='hidden text-center md:table-cell'>{user.postCount}</TableCell>
      <TableCell className='hidden text-center md:table-cell'>{user.followerCount}</TableCell>
      <TableCell className='hidden lg:table-cell text-muted-foreground'>
        {formatDate(new Date(user.createdAt), 'dd-MM-yyyy')}{' '}
      </TableCell>
      <TableCell className='hidden lg:table-cell text-muted-foreground'>
        {formatDate(new Date(user.updatedAt), 'dd-MM-yyyy')}
      </TableCell>
      <TableCell className='text-right'>
        <UserAction
          user={user}
          setSelectedUser={setSelectedUser}
          setIsEditDialogOpen={setIsEditDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        />
      </TableCell>
    </TableRow>
  );
};
