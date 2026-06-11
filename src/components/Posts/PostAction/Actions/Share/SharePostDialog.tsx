import LoadingButton from '@/components/LoadingButton';
import SharedPostEmbed from '@/components/Posts/SharedPostEmbed';
import UserAvatar from '@/components/UserAvatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { usePostContext } from '@/hooks/usePostContext';
import { useToast } from '@/hooks/use-toast';
import { useMentionTracking } from '@/hooks/useMentionTracking';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import type { Editor } from '@tiptap/react';
import { useState } from 'react';
import ShareCaptionEditor from './ShareCaptionEditor';
import { useSharePostMutation } from './mutations';

export default function SharePostDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { post } = usePostContext();
  const { user } = useAppSelector(selectAuth);
  const { toast } = useToast();
  const { mutateAsync: share, isPending } = useSharePostMutation();
  const [content, setContent] = useState('');
  const [editor, setEditor] = useState<Editor | null>(null);

  const mentionedUserIds = useMentionTracking(editor);

  // When sharing a post that is itself a share, embed the root original.
  const embeddedPost = post.sharedPost ?? post;

  const handleShare = async () => {
    try {
      await share({ postId: post.id, content, mentionedUserIds });
      toast({ description: 'Post shared to your profile' });
      setContent('');
      editor?.commands.clearContent();
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        description: typeof error === 'string' ? error : 'Failed to share post',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='max-w-lg'>
        <DialogHeader className='flex flex-col items-center'>
          <DialogTitle>Share Post</DialogTitle>
          <DialogDescription>Share this post to your profile</DialogDescription>
        </DialogHeader>
        <Separator />

        {/* Author + caption editor */}
        <div className='flex gap-2 items-start'>
          <UserAvatar avatarUrl={user?.avatar} fallbackName={user?.fullName ?? 'You'} />
          <ShareCaptionEditor
            content={content}
            onChangeContent={setContent}
            onEditorReady={setEditor}
          />
        </div>

        {/* Embedded original post */}
        <div className='max-h-[320px] overflow-y-auto'>
          <SharedPostEmbed post={embeddedPost} preview />
        </div>

        <div className='flex gap-2 justify-end'>
          <LoadingButton loading={isPending} onClick={handleShare}>
            Share now
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
