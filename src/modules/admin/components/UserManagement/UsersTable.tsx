import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import UserAvatar from '@/components/UserAvatar';
import {
  IApiPaginationResponseWrapper,
  IUserDataWithFollowedStatusType,
} from '@/lib/types/interfaces';
import UserAction from './UserAction';
import VerifiedIcon from '@/components/VerifiedIcon';
import { UseQueryResult } from '@tanstack/react-query';
import { formatDate } from 'date-fns';
import UserStatusBadge from '../UserStatusBadge';
import { cn } from '@/lib/utils';
import UserRoleBadge from '../UserRoleBadge';
import { UserTableSkeleton } from '../Skeletons/UserTableSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Archive } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import MultipleToggleBanUserDialog from '../AdminActions/UserActions/MultipleToggleBanUserDialog';

interface UserTableProps {
  query: UseQueryResult<IApiPaginationResponseWrapper<IUserDataWithFollowedStatusType>, Error>;
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
  const [selectedUsers, setSelectedUsers] = useState<IUserDataWithFollowedStatusType[]>([]);
  const { data, isLoading } = query;
  const [multipleToggleBanUserDialogOpen, setMultipleToggleBanUserDialog] = useState(false);

  const handleSelectAll = () => {
    if (!data) return;

    if (selectedUsers.length === data.data.items.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(data.data.items.map((user) => user));
    }
  };

  const handleToggleSelect = (toggledUser: IUserDataWithFollowedStatusType) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.find((u) => u.id === toggledUser.id);
      if (isSelected) {
        return prev.filter((u) => u.id !== toggledUser.id);
      } else {
        return [...prev, toggledUser];
      }
    });
  };

  const userFilter = (users: IUserDataWithFollowedStatusType[]) =>
    users.filter((user) => {
      if (filterStatus === 'all') return true;
      return (filterStatus.toLowerCase() === 'active') === user.isActive;
    });

  return (
    <>
      <Card className='overflow-hidden border rounded-md'>
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-x-5'>
              <Checkbox
                checked={
                  selectedUsers.length === data?.data.items.length && data?.data.items.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <CardTitle className='text-xl'>Users Database</CardTitle>
            </div>
            {selectedUsers.length > 0 && (
              <div className='flex items-center gap-2'>
                <span className='text-sm text-muted-foreground'>
                  {selectedUsers.length} selected
                </span>
                <Button
                  onClick={() => setMultipleToggleBanUserDialog(true)}
                  variant='destructive'
                  size='sm'
                >
                  <Archive className='w-4 h-4 mr-2' />
                  Delete All
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[40px]'>
                  <Checkbox
                    checked={
                      selectedUsers.length === data?.data.items.length &&
                      data?.data.items.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead className='text-center'>Status</TableHead>
                <TableHead className='text-center '>Role</TableHead>
                <TableHead className='hidden text-center md:table-cell'>Posts</TableHead>
                <TableHead className='hidden text-center md:table-cell'>Followers</TableHead>
                <TableHead className='hidden text-center lg:table-cell'>Join Date</TableHead>
                <TableHead className='hidden text-center lg:table-cell'>Last Active</TableHead>
                <TableHead className='text-center'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            {data && (
              <TableBody>
                {userFilter(data.data.items).map((user) => (
                  <UserItem
                    key={user.id}
                    user={user}
                    isSelected={!!selectedUsers.find((u) => u.id === user.id)}
                    onToggleSelect={handleToggleSelect}
                    setSelectedUser={setSelectedUser}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                  />
                ))}
              </TableBody>
            )}
            {isLoading && <UserTableSkeleton />}
          </Table>
        </CardContent>
      </Card>
      <MultipleToggleBanUserDialog
        onClose={() => setMultipleToggleBanUserDialog(false)}
        open={multipleToggleBanUserDialogOpen}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
    </>
  );
}

const UserItem = ({
  user,
  isSelected,
  onToggleSelect,
  setIsDeleteDialogOpen,
  setIsEditDialogOpen,
  setSelectedUser,
}: {
  user: IUserDataWithFollowedStatusType;
  isSelected: boolean;
  onToggleSelect: (user: IUserDataWithFollowedStatusType) => void;
  setSelectedUser: (user: IUserDataWithFollowedStatusType) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}) => {
  return (
    <TableRow>
      <TableCell className='w-[40px]'>
        <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(user)} />
      </TableCell>
      <TableCell>
        <div className='flex items-center space-x-3'>
          <UserAvatar avatarUrl={user.avatar} />
          <div>
            <div
              className={cn('flex items-center space-x-2 font-medium text-foreground', {
                'text-destructive': user.isBanned,
              })}
            >
              <span
                className={cn('', {
                  'line-through': user.isBanned,
                })}
              >
                {user.fullName}
              </span>
              {user.isVerified && <VerifiedIcon isVerified />}
            </div>
            <p
              className={cn('text-sm text-muted-foreground', {
                'text-destructive line-through': user.isBanned,
              })}
            >
              {user.email}
            </p>
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
      <TableCell className='hidden text-center lg:table-cell text-muted-foreground'>
        {formatDate(new Date(user.createdAt), 'dd-MM-yyyy')}
      </TableCell>
      <TableCell className='hidden text-center lg:table-cell text-muted-foreground'>
        {formatDate(new Date(user.updatedAt), 'dd-MM-yyyy')}
      </TableCell>
      <TableCell className='text-center'>
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
