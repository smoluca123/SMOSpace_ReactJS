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

export default function CreateUserDialog({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const handleCloseDialog = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const handleCreateUser = () => {
    console.log(13);
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Add a new user to the platform</DialogDescription>
        </DialogHeader>
        <form action={handleCreateUser}>
          <div className='grid gap-4 py-4'>
            <div className='grid items-center grid-cols-4 gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input id='name' name='name' className='col-span-3' required />
            </div>
            <div className='grid items-center grid-cols-4 gap-4'>
              <Label htmlFor='email' className='text-right'>
                Email
              </Label>
              <Input id='email' name='email' type='email' className='col-span-3' required />
            </div>
            <div className='grid items-center grid-cols-4 gap-4'>
              <Label htmlFor='role' className='text-right'>
                Role
              </Label>
              <Select name='role' defaultValue='User'>
                <SelectTrigger className='col-span-3'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='User'>User</SelectItem>
                  <SelectItem value='Moderator'>Moderator</SelectItem>
                  <SelectItem value='Admin'>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Create User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
