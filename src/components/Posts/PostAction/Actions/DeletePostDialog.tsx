import LoadingButton from '@/components/LoadingButton';
import { useDeletePostMutation } from '@/components/Posts/PostAction/Actions/mutations';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { usePostContext } from '@/hooks/usePostContext';
export default function DeletePostDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { post } = usePostContext();
  const { mutate: deletePost, isPending } = useDeletePostMutation();
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleDeletePost = () => {
    deletePost(
      { postId: post.id },
      {
        onSuccess: () => {
          toast({
            title: 'Successfully',
            description: 'Your post has been deleted',
            duration: 3000,
          });
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your post.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton loading={isPending} variant='destructive' onClick={handleDeletePost}>
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
