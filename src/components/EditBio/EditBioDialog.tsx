'use no memo';

import { useUpdateBio } from '@/components/EditBio/mutations';
import LoadingButton from '@/components/LoadingButton';
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
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface IProps {
  open: boolean;
  onClose: () => void;
  content?: string;
  onChangeContent?: (content: string) => void;
}

export default function EditBioDialog({ open, onClose, content = '', onChangeContent }: IProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: {
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
        italic: {
          HTMLAttributes: {
            class: 'font-italic',
          },
        },
      }),
      Placeholder.configure({
        placeholder: "What's going on? #Hashtag... @Mention...",
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChangeContent?.(editor.getHTML());
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const { mutate: updateBio, isPending } = useUpdateBio();

  const handleSave = () => {
    updateBio(editor?.getHTML() || '', {
      onSuccess: () => {
        toast({
          title: 'Bio updated',
          description: 'Your bio has been updated successfully',
          duration: 3000,
        });
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bio</DialogTitle>
          <DialogDescription>Edit your bio</DialogDescription>
        </DialogHeader>

        {/* Editor */}
        <div className='w-full min-h-[8rem] max-h-[20rem] overflow-y-auto bg-card lg:rounded-xl rounded-lg px-5 py-3  max-w-full border-border border space-y-2'>
          {/* {editor && <MenuBar editor={editor} />} */}
          <EditorContent editor={editor} className='' />
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton onClick={handleSave} loading={isPending}>
            Save
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
