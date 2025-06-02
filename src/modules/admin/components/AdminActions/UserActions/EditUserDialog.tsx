import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';

export default function EditUserDialog({
  selectedUser,
  onClose,
  open,
}: {
  selectedUser: IUserDataWithFollowedStatusType | null;
  open: boolean;
  onClose: () => void;
}) {
  const handleCloseDialog = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const handleEditUser = () => {
    console.log(1321);
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information</DialogDescription>
        </DialogHeader>
        {selectedUser && (
          <form action={handleEditUser}>
            <div className='grid gap-4 py-4'>
              <div className='grid items-center grid-cols-4 gap-4'>
                <Label htmlFor='edit-name' className='text-right'>
                  Name
                </Label>
                <Input
                  id='edit-name'
                  name='name'
                  defaultValue={selectedUser.fullName}
                  className='col-span-3'
                  required
                />
              </div>
              <div className='grid items-center grid-cols-4 gap-4'>
                <Label htmlFor='edit-email' className='text-right'>
                  Email
                </Label>
                <Input
                  id='edit-email'
                  name='email'
                  type='email'
                  defaultValue={selectedUser.email}
                  className='col-span-3'
                  required
                />
              </div>
              <div className='grid items-center grid-cols-4 gap-4'>
                <Label htmlFor='edit-role' className='text-right'>
                  Role
                </Label>
                <Select name='role' defaultValue={selectedUser.userType.typeName}>
                  <SelectTrigger className='col-span-3'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Member'>Member</SelectItem>
                    <SelectItem value='VIP Member'>VIP Member</SelectItem>
                    <SelectItem value='Manager'>Manager</SelectItem>
                    <SelectItem value='Administrator'>Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='grid items-center grid-cols-4 gap-4'>
                <Label htmlFor='edit-status' className='text-right'>
                  Status
                </Label>
                <Select name='status' defaultValue={selectedUser.isActive ? 'Active' : 'Inactive'}>
                  <SelectTrigger className='col-span-3'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Active'>Active</SelectItem>
                    <SelectItem value='Inactive'>Inactive</SelectItem>
                    <SelectItem value='Banned'>Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type='submit'>Update User</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
