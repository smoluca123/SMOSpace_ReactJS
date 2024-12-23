import PostEditor from '@/components/Posts/Editor/PostEditor';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export default function CreatePostDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-center">Create a Post</DialogTitle>
        </DialogHeader>
        <Separator />
        {/* Editor */}
        <PostEditor onCloseDialog={onClose} />
      </DialogContent>
    </Dialog>
  );
}
