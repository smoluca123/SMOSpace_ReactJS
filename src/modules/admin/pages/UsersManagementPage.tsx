import { SetStateAction, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Users, Activity, Clock, Ban, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  IApiPaginationResponseWrapper,
  IUserDataWithFollowedStatusType,
  StatItem,
} from '@/lib/types/interfaces';
// Import components
import StatCard from '../components/StatCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import UsersTable from '../components/UserManagement/UsersTable';
import CreateUserDialog from '../components/AdminActions/UserActions/CreateUserDialog';
import EditUserDialog from '../components/AdminActions/UserActions/EditUserDialog';
import { useGetAdminUserListQuery } from '../components/querys';
import { useSearchParams } from 'react-router-dom';
import UserPaginationControls from '../components/UserPaginationControls';
import { useDebounce } from '@uidotdev/usehooks';
import TogglebanUserDialog from '../components/AdminActions/UserActions/ToggleBanUserDialog';
import { UseQueryResult } from '@tanstack/react-query';

// Search component
const SearchUser = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<SetStateAction<string>>;
  filterStatus: string;
  setFilterStatus: React.Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className='flex flex-col gap-4 mb-6 sm:flex-row'>
      <div className='relative flex-1'>
        <Search className='absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground' />
        <Input
          placeholder='Search users...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10'
        />
      </div>
      {/* User filter */}
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className='w-[180px]'>
          <Filter className='w-4 h-4 mr-2' />
          <SelectValue placeholder='Filter status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Users</SelectItem>
          <SelectItem value='active'>Active Users</SelectItem>
          <SelectItem value='inactive'>Inactive Users</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default function UsersManagementPage() {
  // State management
  const [selectedUser, setSelectedUser] = useState<IUserDataWithFollowedStatusType | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Debounced search value to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [searchParam, setSearchParam] = useSearchParams();

  // Fetch users data based on search term and filter
  const query = useGetAdminUserListQuery({
    keywords: debouncedSearchTerm,
    limit: parseInt(searchParam.get('limit') || '10'),
    page: parseInt(searchParam.get('page') || '1'),
  });

  // Update debounced value when search term changes
  useEffect(() => {
    setSearchParam({
      pag: '1',
      limit: searchParam.get('limit') || '10',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <UserManagementHeader />

      {/* Statistics Cards */}
      <UserManagementStats query={query} />

      {/* User Management Section  */}

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage all registered users on your platform</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Search and Filter Section */}
          <SearchUser
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />

          {/* Users Table */}
          {query && (
            <UsersTable
              filterStatus={filterStatus}
              query={query}
              setSelectedUser={setSelectedUser}
              setIsEditDialogOpen={setIsEditDialogOpen}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            />
          )}

          <UserPaginationControls query={query} />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditUserDialog
        selectedUser={selectedUser}
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />

      <TogglebanUserDialog
        selectedUser={selectedUser}
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}

const UserManagementHeader = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>User Management</h1>
          <p className='text-muted-foreground'>Manage and monitor all platform users</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className='w-4 h-4 mr-2' />
          Add User
        </Button>
      </div>
      <CreateUserDialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />
    </>
  );
};

const UserManagementStats = ({
  query,
}: {
  query: UseQueryResult<IApiPaginationResponseWrapper<IUserDataWithFollowedStatusType>, Error>;
}) => {
  const totlaUser = query.data?.data.totalCount;

  const USER_STATS: StatItem[] = [
    {
      title: 'Total Users',
      value: totlaUser?.toString() || '0',
      icon: Users,
      trend: 'up',
      change: '+12.5%',
      description: 'Total registered users',
    },
    {
      title: 'Active Users',
      value: query.data?.data.items.filter((user) => user.isActive).length.toString() || '0',
      icon: Activity,
      trend: 'up',
      change: '+8.2%',
      description: 'Users who are active',
    },
    {
      title: 'Inactive Users',
      value: query.data?.data.items.filter((user) => !user.isActive).length.toString() || '0',
      icon: Clock,
      trend: 'down',
      change: '-2.1%',
      description: 'Users who are inactive',
    },
    {
      title: 'Banned Users',
      value: query.data?.data.items.filter((user) => user.isBanned).length.toString() || '0',
      icon: Ban,
      trend: 'down',
      change: '-0.5%',
      description: 'Users who are banned',
    },
  ];

  return (
    <div className='grid gap-4 md:grid-cols-4'>
      {USER_STATS.map((stat) => (
        <StatCard stat={stat} key={stat.title} />
      ))}
    </div>
  );
};
