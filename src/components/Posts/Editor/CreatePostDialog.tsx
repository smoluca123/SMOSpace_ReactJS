import CreatePostForm from '@/components/Posts/Editor/CreatePostForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      <DialogContent className=''>
        <DialogHeader className='flex flex-col items-center'>
          <DialogTitle className=''>Create a Post</DialogTitle>
          <DialogDescription className=''>
            Create a post to share with your friends
          </DialogDescription>
        </DialogHeader>
        <Separator />
        {/* Editor */}
        <CreatePostForm onCloseDialog={onClose} />
      </DialogContent>
    </Dialog>
  );
}
