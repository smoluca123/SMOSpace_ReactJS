import DropdownMenuItemWithIcon from '@/components/DropdownMenuItemWithIcon';
import DeletePostDialog from '@/components/Posts/PostAction/Actions/DeletePostDialog';
import { UpdatePostDialog } from '@/components/Posts/PostAction/Actions/UpdatePost';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePostContext } from '@/hooks/usePostContext';
import { PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { Edit, Ellipsis, Trash } from 'lucide-react';
import { useState } from 'react';

export default function PostMoreButton({ className }: PropsWithClassName) {
  const { user } = useAppSelector(selectAuth);
  const { post } = usePostContext();
  if (!user || user.id !== post.author.id) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className={cn('size-6', className)} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40'>
        <DropdownMenuLabel>Post Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Update Post */}
        <UpdatePostButton />

        {/* Delete Post */}
        <DeletePostButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DeletePostButton() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDialog = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDeleteDialog(true);
  };

  return (
    <>
      <DropdownMenuItemWithIcon
        Icon={Trash}
        className='h-10'
        variant='destructive'
        onClick={handleOpenDialog}
      >
        Delete
      </DropdownMenuItemWithIcon>
      <DeletePostDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} />
    </>
  );
}

export function UpdatePostButton() {
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const handleOpenDialog = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenUpdateDialog(true);
  };

  return (
    <>
      <DropdownMenuItemWithIcon Icon={Edit} className='h-10' onClick={handleOpenDialog}>
        Edit
      </DropdownMenuItemWithIcon>
      <UpdatePostDialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} />
    </>
  );
}
