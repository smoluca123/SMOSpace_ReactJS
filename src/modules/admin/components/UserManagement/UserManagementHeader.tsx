import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import CreateUserDialog from '../AdminActions/UserActions/CreateUserDialog';

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

export default UserManagementHeader;
