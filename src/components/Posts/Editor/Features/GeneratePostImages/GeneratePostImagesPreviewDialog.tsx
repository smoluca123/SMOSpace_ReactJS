'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useState } from 'react';

interface GeneratePostImagesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  onAddImages: (images: string[]) => void;
}

export default function GeneratePostImagesPreviewDialog({
  isOpen,
  onClose,
  images,
  onAddImages,
}: GeneratePostImagesDialogProps) {
  const { user } = useAppSelector(selectAuth);
  const [isChecked, setIsChecked] = useState<boolean[]>(Array(images.length).fill(false));
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  if (!user) return null;

  const handleCheckboxChange = (index: number) => {
    setIsChecked((prev) => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];
      if (newChecked[index]) {
        setSelectedImages((prev) => [...prev, images[index]]);
      } else {
        setSelectedImages((prev) => prev.filter((image) => image !== images[index]));
      }
      return newChecked;
    });
  };

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

        <div className='grid grid-cols-12 gap-4 max-h-[80vh] overflow-y-auto'>
          {images.map((image, index) => (
            <div
              className={cn('col-span-12 md:col-span-6 relative', {
                'col-span-12': images.length === 1,
              })}
            >
              <Checkbox
                className='absolute top-2 right-2 data-[state=checked]:text-white z-10'
                checked={isChecked[index]}
                onCheckedChange={() => handleCheckboxChange(index)}
              />
              <img
                src={image}
                alt='Post Image'
                className={cn('object-cover w-full h-full rounded-lg cursor-pointer', {
                  'opacity-90': !isChecked[index],
                })}
                onClick={() => handleCheckboxChange(index)}
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            disabled={selectedImages.length === 0}
            onClick={() => {
              onAddImages(selectedImages);
              setSelectedImages([]);
              setIsChecked(Array(images.length).fill(false));
              onClose();
            }}
          >
            Add to Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
