import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import usePostsManagementContext from '@/hooks/usePostsManagementContext';
import { IPostDataType } from '@/lib/types/interfaces';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import DeletePostDialog from '../AdminActions/PostActions/DeletePostDialog';
import EditPostDialog from '../AdminActions/PostActions/EditPostDialog';
import { useState } from 'react';

interface PostActionProps {
  post: IPostDataType;
}

export default function PostAction({ post }: PostActionProps) {
  const { setSelectedPost } = usePostsManagementContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='w-8 h-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreVertical className='w-4 h-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>
            <Eye className='w-4 h-4 mr-2' />
            View Post
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSelectedPost(post);
              setIsEditDialogOpen(true);
            }}
          >
            <Edit className='w-4 h-4 mr-2' />
            Edit Post
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='text-destructive'
            onClick={() => {
              setSelectedPost(post);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className='w-4 h-4 mr-2' />
            Delete Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostDialog
        post={post}
        onClose={() => setIsDeleteDialogOpen(false)}
        open={isDeleteDialogOpen}
      />

      <EditPostDialog
        onClose={() => setIsEditDialogOpen(false)}
        open={isEditDialogOpen}
        post={post}
      />
    </>
  );
}
