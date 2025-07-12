import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
// Import components
import UsersTable from '../components/UserManagement/UsersTable';
import EditUserDialog from '../components/AdminActions/UserActions/EditUserDialog';
import { useGetAdminUserListQuery } from '../components/querys';
import { useSearchParams } from 'react-router-dom';
import UserPaginationControls from '../components/UserPaginationControls';
import { useDebounce } from '@uidotdev/usehooks';
import TogglebanUserDialog from '../components/AdminActions/UserActions/ToggleBanUserDialog';
import UserManagementHeader from '../components/UserManagement/UserManagementHeader';
import UserManagementStats from '../components/UserManagement/UserManagementStats';
import SearchUser from '../components/UserManagement/SearchUser';

export default function UsersManagementPage() {
  // State management
  const [selectedUser, setSelectedUser] = useState<IUserDataWithFollowedStatusType | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchParam, setSearchParam] = useSearchParams();

  const page = Number(searchParam.get('page')) || 1;
  const limit = Number(searchParam.get('limit')) || 10;

  // Debounced search value to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch users data based on search term and filter
  const query = useGetAdminUserListQuery({
    keywords: debouncedSearchTerm,
    limit,
    page,
  });

  // Update debounced value when search term changes
  useEffect(() => {
    if (query.isSuccess) {
      setSearchParam({
        page: '1',
        limit: limit.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (query.isSuccess && page > query.data?.data.totalPage) {
      setSearchParam({
        page: '1',
        limit: limit.toString(),
      });
    }
  }, [query, setSearchParam, limit, page]);

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <UserManagementHeader />

      {/* Statistics Cards */}
      <UserManagementStats />

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
        setSelectedUser={setSelectedUser}
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
