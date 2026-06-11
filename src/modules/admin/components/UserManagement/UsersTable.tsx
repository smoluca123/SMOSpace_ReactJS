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
import { Settings } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import MultipleToggleBanUserDialog from '../AdminActions/UserActions/MultipleToggleBanUserDialog';

// --- Types ---

interface UserTableProps {
  query: UseQueryResult<IApiPaginationResponseWrapper<IUserDataWithFollowedStatusType>, Error>;
  setSelectedUser: (user: IUserDataWithFollowedStatusType) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  filterStatus: string;
}

interface UserItemProps {
  user: IUserDataWithFollowedStatusType;
  isSelected: boolean;
  onToggleSelect: (user: IUserDataWithFollowedStatusType) => void;
  setSelectedUser: (user: IUserDataWithFollowedStatusType) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}

// --- Helpers ---

function filterUsersByStatus(users: IUserDataWithFollowedStatusType[], status: string) {
  if (status === 'all') return users;
  return users.filter((user) => (status === 'active') === user.isActive);
}

// --- Components ---

export default function UsersTable({
  query,
  setSelectedUser,
  setIsEditDialogOpen,
  setIsDeleteDialogOpen,
  filterStatus,
}: UserTableProps) {
  const [selectedUsers, setSelectedUsers] = useState<IUserDataWithFollowedStatusType[]>([]);
  const [isMultipleBanDialogOpen, setIsMultipleBanDialogOpen] = useState(false);
  const { data, isLoading } = query;

  const items = data?.data.items ?? [];
  const filteredUsers = filterUsersByStatus(items, filterStatus);
  const allSelected = selectedUsers.length === items.length && items.length > 0;

  const handleSelectAll = () => {
    setSelectedUsers(allSelected ? [] : [...items]);
  };

  const handleToggleSelect = (toggledUser: IUserDataWithFollowedStatusType) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u.id === toggledUser.id);
      return exists ? prev.filter((u) => u.id !== toggledUser.id) : [...prev, toggledUser];
    });
  };

  return (
    <>
      <Card className='overflow-hidden border rounded-md'>
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-xl'>Users Database</CardTitle>
            <div
              className={cn(
                'flex items-center gap-4 transition-all duration-200',
                selectedUsers.length === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'opacity-100 pointer-events-auto',
              )}
            >
              <span className='text-sm text-muted-foreground'>
                {selectedUsers.length} selected
              </span>
              <Button
                disabled={selectedUsers.length === 0}
                onClick={() => setIsMultipleBanDialogOpen(true)}
                size='sm'
              >
                <Settings className='w-4 h-4 mr-2' />
                Toggle All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[40px]'>
                  <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead className='text-center'>Status</TableHead>
                <TableHead className='text-center'>Role</TableHead>
                <TableHead className='hidden text-center md:table-cell'>Posts</TableHead>
                <TableHead className='hidden text-center md:table-cell'>Followers</TableHead>
                <TableHead className='hidden text-center lg:table-cell'>Join Date</TableHead>
                <TableHead className='hidden text-center lg:table-cell'>Last Active</TableHead>
                <TableHead className='text-center'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            {data && (
              <TableBody>
                {filteredUsers.map((user) => (
                  <UserItem
                    key={user.id}
                    user={user}
                    isSelected={selectedUsers.some((u) => u.id === user.id)}
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
        onClose={() => setIsMultipleBanDialogOpen(false)}
        open={isMultipleBanDialogOpen}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
    </>
  );
}

function UserItem({
  user,
  isSelected,
  onToggleSelect,
  setIsDeleteDialogOpen,
  setIsEditDialogOpen,
  setSelectedUser,
}: UserItemProps) {
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
              <span className={cn({ 'line-through': user.isBanned })}>{user.fullName}</span>
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
}
