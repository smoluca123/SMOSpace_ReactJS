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

export default function MultiplePostDeleteDialog({
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

  const { selectedPosts } = usePostsManagementContext();
  const { mutate } = useAdminDeletePostsMutation();

  const handleMutipleDelete = () => {
    mutate(
      selectedPosts.map((post) => post.id),
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <>
      {/* Bulk Delete Dialog */}
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
            <Button variant='destructive' onClick={handleMutipleDelete}>
              Delete {selectedPosts.length} Posts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
