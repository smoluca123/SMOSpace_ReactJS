import UpdatePostForm from '@/components/Posts/PostAction/Actions/UpdatePost/UpdatePostForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function UpdatePostDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='overflow-x-hidden'>
        <DialogHeader className='flex flex-col items-center'>
          <DialogTitle>Update Post</DialogTitle>
          <DialogDescription>Update your post with the new content.</DialogDescription>
        </DialogHeader>
        <UpdatePostForm onCloseDialog={onClose} />
      </DialogContent>
    </Dialog>
  );
}
