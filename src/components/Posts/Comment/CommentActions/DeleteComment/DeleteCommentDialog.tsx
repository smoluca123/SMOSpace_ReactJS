import LoadingButton from '@/components/LoadingButton';
import { useDeleteCommentMutation } from '@/components/Posts/Comment/CommentActions/DeleteComment/mutations';
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
import useCommentContext from '@/hooks/useCommentContext';

export default function DeleteCommentDialog({
  open,
  onOpenChange,
  onClose,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}) {
  const { comment } = useCommentContext();

  const { mutate: deleteComment, isPending } = useDeleteCommentMutation();

  const handleOpenChange = (open: boolean) => {
    if (!open) onOpenChange(open);
  };

  const handleDeleteComment = () => {
    deleteComment(
      { commentId: comment.id },
      {
        onSuccess: () => {
          onClose();
          toast({
            title: 'Successfully!',
            description: 'Your comment has been deleted',
            duration: 3000,
          });
        },
        onError: (error) => {
          toast({
            variant: 'destructive',
            title: 'Error!',
            description: error.message,
            duration: 3000,
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete comment?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your comment.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton variant='destructive' loading={isPending} onClick={handleDeleteComment}>
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
