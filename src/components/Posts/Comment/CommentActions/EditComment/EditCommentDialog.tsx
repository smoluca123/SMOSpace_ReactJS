import LoadingButton from '@/components/LoadingButton';
import { CommentEditor } from '@/components/Posts/Comment/CommentActions/CreateComment/CommentEditor';
import { useEditCommentMutation } from '@/components/Posts/Comment/CommentActions/EditComment/mutations';
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
import { useState } from 'react';

export default function EditCommentDialog({
  open,
  onOpenChange,
  onClose,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}) {
  const { comment } = useCommentContext();
  const [content, setContent] = useState(comment.content);
  const handleOpenChange = (open: boolean) => {
    if (!open) onOpenChange(open);
  };

  const { mutate: editComment, isPending } = useEditCommentMutation();

  const handleEditComment = () => {
    editComment(
      {
        commentId: comment.id,
        content,
      },
      {
        onSuccess: () => {
          onClose();
          toast({
            title: 'Comment updated',
            description: 'Comment updated successfully',
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
          <DialogTitle>Edit comment?</DialogTitle>
          <DialogDescription>Edit your comment</DialogDescription>
        </DialogHeader>
        <CommentEditor content={content} onChangeContent={setContent} />
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton loading={isPending} className='text-white' onClick={handleEditComment}>
            Edit
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
