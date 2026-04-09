import LoadingButton from '@/components/LoadingButton';
import { useSubmitPostMutation } from '@/components/Posts/Editor/mutations';
import PostEditor from '@/components/Posts/Editor/PostEditor';
import { toast } from '@/hooks/use-toast';
import { useDraftPost } from '@/hooks/useDraftPost';
import { useMentionTracking } from '@/hooks/useMentionTracking';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import type { Editor } from '@tiptap/react';

export default function CreatePostForm({ onCloseDialog }: { onCloseDialog: () => void }) {
  const [editorContent, setEditorContent] = useState('');
  const [media, setMedia] = useState<File[]>([]);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [showDraftNotification, setShowDraftNotification] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);

  const { mutate, isPending } = useSubmitPostMutation();
  const { loadDraft, clearDraft, hasDraft } = useDraftPost(editorContent, media.length, isPrivate);

  // Track mentioned user IDs from editor
  const mentionedUserIds = useMentionTracking(editor);

  // Check for draft on mount
  useEffect(() => {
    if (hasDraft()) {
      setShowDraftNotification(true);
    }
  }, [hasDraft]);

  const handleLoadDraft = () => {
    const draft = loadDraft();
    if (draft) {
      setEditorContent(draft.content);
      setIsPrivate(draft.isPrivate);
      toast({
        title: 'Draft loaded',
        description: `Post draft from ${new Date(draft.timestamp).toLocaleString()} has been restored.`,
        duration: 3000,
      });
      setShowDraftNotification(false);
    }
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftNotification(false);
    toast({
      title: 'Draft discarded',
      description: 'Your saved draft has been removed.',
      duration: 2000,
    });
  };

  const onSubmit = () => {
    mutate(
      {
        content: editorContent,
        isPrivate,
        images: media,
        mentionedUserIds, // Include mentioned user IDs
      },
      {
        onSuccess: () => {
          setEditorContent('');
          setMedia([]);
          clearDraft(); // Clear draft after successful post
          toast({
            title: 'Post submitted!',
            description: 'Your post has been successfully posted.',
            duration: 3000,
          });
          onCloseDialog();
        },
      },
    );
  };

  return (
    <div className='space-y-4 overflow-x-hidden'>
      {/* Draft notification */}
      {showDraftNotification && (
        <div className='flex items-center justify-between p-3 border rounded-md bg-muted border-border'>
          <div className='flex items-center gap-2'>
            <FileText className='w-4 h-4 text-primary' />
            <p className='text-sm'>You have an unsaved draft</p>
          </div>
          <div className='flex gap-2'>
            <Button variant='ghost' size='sm' onClick={handleDiscardDraft}>
              Discard
            </Button>
            <Button variant='outline' size='sm' onClick={handleLoadDraft}>
              Load Draft
            </Button>
          </div>
        </div>
      )}

      <PostEditor
        isPrivate={isPrivate}
        content={editorContent}
        onChangeContent={setEditorContent}
        onChangeIsPrivate={setIsPrivate}
        onChangeMedia={setMedia}
        media={media}
        onEditorReady={setEditor}
      />
      <LoadingButton
        loading={isPending}
        onClick={onSubmit}
        disabled={!editorContent}
        className='w-full'
      >
        Post
      </LoadingButton>
    </div>
  );
}
