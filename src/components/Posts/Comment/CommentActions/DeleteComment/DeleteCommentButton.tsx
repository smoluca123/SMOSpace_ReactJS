import DropdownMenuItemWithIcon from '@/components/DropdownMenuItemWithIcon';
import DeleteCommentDialog from '@/components/Posts/Comment/CommentActions/DeleteComment/DeleteCommentDialog';

import { Trash } from 'lucide-react';
import { useState } from 'react';

export default function DeleteCommentButton() {
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDialog(true);
  };

  return (
    <>
      <DropdownMenuItemWithIcon variant='destructive' Icon={Trash} onClick={handleOpenDialog}>
        Delete
      </DropdownMenuItemWithIcon>
      <DeleteCommentDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
}
