import { createStoryAPI, uploadStoryToStorj } from '@/apis/storyApi';
import UserAvatar from '@/components/UserAvatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { storyFeedQueryKey } from '@/modules/story/querys';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Loader2, Plus } from 'lucide-react';
import { useRef, useState } from 'react';

const MAX_VIDEO_SECONDS = 60;
const MAX_BYTES = 50 * 1024 * 1024; // 50MB (matches server limit)

/** Read a video file's duration (seconds) without playing it. */
function readVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(video.duration) ? video.duration : 0);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
    video.src = url;
  });
}

export default function CreateStoryButton() {
  const { user } = useAppSelector(selectAuth);
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const clearPreview = () => {
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ file, duration }: { file: File; duration?: number }) => {
      // 1) Upload media directly to storage (Storj) with live progress.
      const { key, type } = await uploadStoryToStorj(file, setProgress);
      // 2) Create the story record referencing the uploaded object.
      return createStoryAPI({ key, type, duration });
    },
    onSuccess: () => {
      toast({ description: 'Story posted', duration: 2500 });
      queryClient.invalidateQueries({ queryKey: storyFeedQueryKey });
      // Brief "done" state before closing the dialog.
      setTimeout(() => {
        setDialogOpen(false);
        clearPreview();
        setProgress(0);
      }, 600);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        description: typeof error === 'string' ? error : 'Failed to post story',
      });
      setDialogOpen(false);
      clearPreview();
      setProgress(0);
    },
  });

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = '';
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      toast({ variant: 'destructive', description: 'Only images or videos are allowed' });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast({ variant: 'destructive', description: 'File is too large (max 50MB)' });
      return;
    }

    let duration: number | undefined;
    if (isVideo) {
      duration = Math.round(await readVideoDuration(file));
      if (duration > MAX_VIDEO_SECONDS) {
        toast({
          variant: 'destructive',
          description: `Video is too long (max ${MAX_VIDEO_SECONDS}s)`,
        });
        return;
      }
    }

    // Show the upload dialog with a live preview + progress.
    clearPreview();
    setPreview({ url: URL.createObjectURL(file), type: isVideo ? 'video' : 'image' });
    setProgress(0);
    setDialogOpen(true);
    mutate({ file, duration });
  };

  const handleButtonClick = () => {
    // While uploading, the button reveals the progress dialog instead of
    // opening a new file picker.
    if (isPending) {
      setDialogOpen(true);
      return;
    }
    inputRef.current?.click();
  };

  const isDone = progress >= 100;

  return (
    <>
      <button
        type='button'
        onClick={handleButtonClick}
        className='flex flex-col gap-1 items-center w-[72px] shrink-0 focus:outline-none'
      >
        <div className='grid relative place-items-center w-[70px] h-[70px] rounded-full bg-muted shrink-0'>
          <UserAvatar
            avatarUrl={user?.avatar}
            fallbackName={user?.fullName ?? 'You'}
            className='w-16 h-16 rounded-full ring-2 ring-card'
            showStatus={false}
          />
          <span className='absolute -right-0.5 -bottom-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground ring-2 ring-background'>
            {isPending ? (
              <Loader2 className='w-3.5 h-3.5 animate-spin' />
            ) : (
              <Plus className='w-4 h-4' />
            )}
          </span>
        </div>
        <span className='w-full text-xs text-center truncate text-foreground'>
          {isPending ? `Uploading ${progress}%` : 'Your story'}
        </span>
        <input
          ref={inputRef}
          type='file'
          accept='image/*,video/*'
          onChange={handleSelect}
          className='hidden'
        />
      </button>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          // Don't allow closing mid-upload by clicking outside; let it finish.
          if (!open && isPending && !isDone) return;
          setDialogOpen(open);
        }}
      >
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>{isDone ? 'Story uploaded' : 'Uploading your story'}</DialogTitle>
          </DialogHeader>

          {preview && (
            <div className='overflow-hidden mx-auto rounded-lg bg-muted'>
              {preview.type === 'video' ? (
                <video src={preview.url} className='max-h-64' muted autoPlay loop playsInline />
              ) : (
                <img src={preview.url} alt='Preview' className='max-h-64' />
              )}
            </div>
          )}

          <div className='space-y-2'>
            <div className='h-2 rounded-full overflow-hidden bg-muted'>
              <div
                className='h-full bg-primary transition-[width] duration-200'
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className='flex gap-2 justify-center items-center text-sm text-muted-foreground'>
              {isDone ? (
                <>
                  <CheckCircle2 className='w-4 h-4 text-primary' />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>{progress}%</span>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
