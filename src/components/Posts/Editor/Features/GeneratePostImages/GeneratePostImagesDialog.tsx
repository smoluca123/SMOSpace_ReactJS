'use client';

import GeneratePostImagesForm from '@/components/Posts/Editor/Features/GeneratePostImages/GeneratePostImagesForm';
import GeneratePostImagesPreviewDialog from '@/components/Posts/Editor/Features/GeneratePostImages/GeneratePostImagesPreviewDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useState } from 'react';

interface GeneratePostImagesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImages: (images: string[]) => void;
}

export default function GeneratePostImagesDialog({
  isOpen,
  onClose,
  onAddImages,
}: GeneratePostImagesDialogProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const { user } = useAppSelector(selectAuth);

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => isOpen && onClose()}>
      <DialogContent className='md:max-w-full md:w-fit'>
        <DialogHeader>
          <DialogTitle>Generate Post</DialogTitle>
          <DialogDescription>
            Generate new post content using AI. This will consume credits from your balance.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className='flex flex-col gap-5 items-start md:flex-row'>
          <GeneratePostImagesForm
            setImages={setImages}
            setIsPreviewDialogOpen={setIsPreviewDialogOpen}
          />
        </div>
      </DialogContent>
      <GeneratePostImagesPreviewDialog
        isOpen={isPreviewDialogOpen}
        onClose={() => setIsPreviewDialogOpen(false)}
        images={images}
        onAddImages={(selectedImages) => {
          onAddImages(selectedImages);
          setIsPreviewDialogOpen(false);
          onClose();
        }}
      />
    </Dialog>
  );
}
