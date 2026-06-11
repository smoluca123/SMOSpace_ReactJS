import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import usePostsManagementContext from '@/hooks/usePostsManagementContext';
import { useAdminDeletePostsMutation } from '../../mutations';
import LoadingButton from '@/components/LoadingButton';

export default function MultiplePostDeleteDialog({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { selectedPosts, setSelectedPosts } = usePostsManagementContext();
  const { mutate, isPending } = useAdminDeletePostsMutation();

  const handleCloseDialog = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  const handleMultipleDelete = () => {
    mutate(
      selectedPosts.map((post) => post.id),
      {
        onSuccess: () => {
          setSelectedPosts([]);
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Multiple Posts</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {selectedPosts.length} posts? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton
            variant='destructive'
            onClick={handleMultipleDelete}
            loading={isPending}
          >
            Delete {selectedPosts.length} Posts
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
