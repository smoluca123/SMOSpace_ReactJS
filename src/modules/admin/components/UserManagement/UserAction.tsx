import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserAction({
  user,
  setIsDeleteDialogOpen,
  setIsEditDialogOpen,
  setSelectedUser,
}: {
  user: IUserDataWithFollowedStatusType;
  setSelectedUser: (user: IUserDataWithFollowedStatusType) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='w-8 h-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='w-4 h-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to={`/admin/users/${user.username}`}>
              <Eye className='w-4 h-4 mr-2' />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSelectedUser(user);
              setIsEditDialogOpen(true);
            }}
          >
            <Edit className='w-4 h-4 mr-2' />
            Edit User
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={cn('', {
              'text-destructive': !user.isBanned,
              'text-primary': user.isBanned,
            })}
            onClick={() => {
              setSelectedUser(user);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className='w-4 h-4 mr-2' />
            {user.isBanned ? ' Unban User' : 'Ban User'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
