import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { POST_LIMITS, POST_VALIDATION_MESSAGES } from '@/constants/post';
import { processImages } from '@/utils/imageUtils';
import { toast } from '@/hooks/use-toast';

export default function AddMediaButton({
  onChangeMedia,
}: {
  onChangeMedia: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsProcessing(true);

    try {
      // Check total image count
      onChangeMedia((prev) => {
        const totalCount = prev.length + files.length;
        if (totalCount > POST_LIMITS.MAX_IMAGES) {
          toast({
            title: 'Too many images',
            description: POST_VALIDATION_MESSAGES.TOO_MANY_IMAGES(POST_LIMITS.MAX_IMAGES),
            variant: 'destructive',
          });

          return prev;
        }

        // Process images (validate and compress) asynchronously
        processImages(files).then(({ validFiles, errors }) => {
          // Show errors if any
          if (errors.length > 0) {
            errors.forEach((error) => {
              toast({
                title: 'Invalid file',
                description: error,
                variant: 'destructive',
              });
            });
          }

          // Add valid files
          if (validFiles.length > 0) {
            onChangeMedia((current) => [...validFiles, ...current]);
          }

          setIsProcessing(false);
        });

        return prev; // Return current state, will be updated when processing completes
      });
    } catch (error) {
      console.error('Failed to process images:', error);
      toast({
        title: 'Error',
        description: 'Failed to process images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }

    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <label
      htmlFor='post-media-upload'
      className={`flex justify-center items-center w-20 h-20 rounded-md cursor-pointer transition-colors ${
        isProcessing ? 'bg-muted/50 cursor-wait' : 'bg-muted hover:bg-muted/80'
      }`}
    >
      {isProcessing ? (
        <div className='w-5 h-5 border-2 rounded-full border-primary border-t-transparent animate-spin' />
      ) : (
        <Plus className='w-5 h-5' />
      )}
      <input
        id='post-media-upload'
        type='file'
        accept={POST_LIMITS.ACCEPTED_IMAGE_TYPES.join(',')}
        multiple
        onChange={handleChange}
        className='sr-only'
        ref={inputRef}
        disabled={isProcessing}
        aria-label='Upload images for post'
      />
    </label>
  );
}
