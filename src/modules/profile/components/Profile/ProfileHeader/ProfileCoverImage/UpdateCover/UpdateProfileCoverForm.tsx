'use no memo';

import { IUserDataType } from '@/lib/types/interfaces';
import Dropzone from 'react-dropzone';
import { useEffect, useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import LoadingButton from '@/components/LoadingButton';
import { toast } from '@/hooks/use-toast';
import { motion, useAnimation } from 'framer-motion';
import { useUpdateCoverImageMutation } from '@/modules/profile/components/Profile/ProfileHeader/ProfileCoverImage/UpdateCover/mutations';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IProps {
  userData: IUserDataType;
  onClose: () => void;
}

export default function UpdateProfileCoverForm({ userData, onClose }: IProps) {
  const [image, setImage] = useState<string | undefined>(userData.coverImage);
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { mutate, isPending: isPendingUpdateAvatar } = useUpdateCoverImageMutation({
    userId: userData.id,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [imageLoaded, setImageLoaded] = useState(false);

  const [isPending, startTransition] = useTransition();

  const onDrop = (acceptedFiles: File[]) => {
    setImageLoaded(false);
    setIsDragging(false);
    if (acceptedFiles.length === 0) return;

    // Revoke old URL if exists
    if (image && image.startsWith('blob:')) {
      URL.revokeObjectURL(image);
    }

    // Create new URL for dropped image
    const imageUrl = URL.createObjectURL(acceptedFiles[0]);
    setAcceptedFiles(acceptedFiles);
    setImage(imageUrl);

    // Reset animation and position
    controls.set({ y: 0 });
    setImageLoaded(true);
  };

  const handleRemoveImage = () => {
    if (image && image.startsWith('blob:')) {
      URL.revokeObjectURL(image);
    }
    setImage(undefined);
    setAcceptedFiles([]);
  };

  const handleSave = async () => {
    try {
      if (acceptedFiles.length === 0) {
        toast({
          title: 'No image selected',
          description: 'Please select an image to upload',
          variant: 'destructive',
        });
        return;
      }

      startTransition(async () => {
        // Upload to server
        mutate(acceptedFiles[0], {
          onSuccess: () => {
            toast({
              title: 'Successfully',
              description: 'Your cover image has been updated',
              duration: 3000,
            });
            onClose();
          },
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Reset animation when image loaded
  useEffect(() => {
    if (imageLoaded) {
      controls.start({ y: 0 });
    }
  }, [imageLoaded, controls, image]);

  return (
    <div className='space-y-4'>
      <Dropzone
        onDrop={onDrop}
        accept={{
          'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
        }}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        maxFiles={1}
      >
        {({ getRootProps, getInputProps, open }) => (
          <div className='relative'>
            <div
              {...getRootProps()}
              className={cn(
                'relative h-[350px] overflow-hidden rounded-lg border-2 transition-all duration-200',
                isDragging
                  ? 'border-primary bg-primary/5 border-dashed'
                  : 'border-transparent bg-muted/50',
                !image && 'border-dashed border-muted-foreground/25',
              )}
              ref={containerRef}
            >
              {/* Preview Image if exists */}
              {image ? (
                <>
                  <motion.img
                    src={image}
                    alt={userData.displayName}
                    className='block object-contain w-full'
                    style={{
                      transformOrigin: 'top',
                      cursor: 'grab',
                    }}
                    drag='y'
                    dragConstraints={containerRef}
                    dragElastic={0.1}
                    whileTap={{ cursor: 'grabbing' }}
                    animate={controls}
                    onLoad={() => setImageLoaded(true)}
                    key={image}
                    onClick={(e) => {
                      e.stopPropagation();
                      // open();
                    }}
                  />

                  {/* Remove button */}
                  <Button
                    type='button'
                    variant='outline-destructive'
                    size='icon'
                    className='absolute top-4 right-4'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                  >
                    <X className='w-4 h-4' />
                  </Button>

                  {/* Drag indicator overlay when dragging */}
                  {isDragging && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className='absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none bg-primary/10 backdrop-blur-sm'
                    >
                      <Upload className='w-16 h-16 text-primary animate-bounce' />
                      <p className='text-lg font-semibold text-primary'>Drop to replace image</p>
                    </motion.div>
                  )}
                </>
              ) : (
                /* Empty state - Click or drag to upload */
                <div className='flex flex-col items-center justify-center h-full gap-4 px-4'>
                  {isDragging ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className='flex flex-col items-center gap-4'
                    >
                      <Upload className='w-20 h-20 text-primary animate-bounce' />
                      <p className='text-xl font-semibold text-primary'>Drop image here</p>
                    </motion.div>
                  ) : (
                    <>
                      <ImageIcon className='w-20 h-20 text-muted-foreground/50' />
                      <div className='space-y-2 text-center'>
                        <p className='text-lg font-medium text-foreground'>
                          No cover image selected
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          Drag and drop an image here, or click to browse
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Supports: PNG, JPG, JPEG, WebP
                        </p>
                      </div>
                      <Button
                        type='button'
                        variant='outline'
                        className='gap-2 mt-2'
                        onClick={(e) => {
                          e.stopPropagation();
                          open();
                        }}
                      >
                        <Upload className='w-4 h-4' />
                        Choose Image
                      </Button>
                    </>
                  )}
                </div>
              )}

              <input {...getInputProps()} />
            </div>

            {/* Helper text below preview */}
            {image && !isDragging && (
              <p className='mt-2 text-xs text-center text-muted-foreground'>
                💡 Drag the image up/down to adjust position, or drag new image to replace
              </p>
            )}
          </div>
        )}
      </Dropzone>

      {/* Actions */}
      <div className='flex justify-end gap-2 pt-4'>
        <Button variant='outline' onClick={onClose} disabled={isPending || isPendingUpdateAvatar}>
          Cancel
        </Button>
        <LoadingButton
          loading={isPending || isPendingUpdateAvatar}
          onClick={handleSave}
          disabled={!image || acceptedFiles.length === 0}
        >
          Save
        </LoadingButton>
      </div>
    </div>
  );
}
