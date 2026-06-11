import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import LoadingButton from '@/components/LoadingButton';
import { useAdminDeletePostMutation } from '../../mutations';
import { IPostDataType } from '@/lib/types/interfaces';

export default function DeletePostDialog({
  open,
  onClose,
  post,
}: {
  open: boolean;
  onClose: () => void;
  post: IPostDataType;
}) {
  const { mutate, isPending } = useAdminDeletePostMutation();

  if (!post) return null;

  const handleCloseDialog = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const handleDeletePost = () => {
    mutate(
      { postId: post.id },
      { onSuccess: onClose },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton variant='destructive' onClick={handleDeletePost} loading={isPending}>
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
