import DropdownMenuItemWithIcon from '@/components/DropdownMenuItemWithIcon';
import EditCommentDialog from '@/components/Posts/Comment/CommentActions/EditComment/EditCommentDialog';
import { Edit } from 'lucide-react';
import { useState } from 'react';

export default function EditCommentButton() {
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDialog(true);
  };
  return (
    <>
      <DropdownMenuItemWithIcon Icon={Edit} onClick={handleOpenDialog}>
        Edit
      </DropdownMenuItemWithIcon>
      <EditCommentDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
}
