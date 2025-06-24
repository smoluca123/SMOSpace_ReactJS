'use no memo';

import LoadingButton from '@/components/LoadingButton';
import PostEditor from '../../Editor/PostEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useAdminEditPostMutation } from '../../mutations';
import { useState } from 'react';
import { IPostDataType } from '@/lib/types/interfaces';
import { useQueryClient } from '@tanstack/react-query';

export default function EditPostDialog({
  open,
  onClose,
  post,
}: {
  open: boolean;
  onClose: () => void;
  post: IPostDataType;
}) {
  const handleCloseDialog = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const [editorContent, setEditorContent] = useState(post.content);
  const [isPrivate, setIsPrivate] = useState<boolean>(post.isPrivate);

  const { mutate, isPending } = useAdminEditPostMutation();

  const queryClinet = useQueryClient();

  const handleEditPost = () => {
    mutate(
      {
        postId: post.id,
        content: editorContent,
        authorId: post.author.id,
        isPrivate,
      },
      {
        onSuccess: () => {
          queryClinet.invalidateQueries({
            queryKey: ['admin-posts'],
          });
        },
      },
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className='overflow-x-hidden'>
        <DialogHeader className='flex flex-col items-center'>
          <DialogTitle>Update Post</DialogTitle>
          <DialogDescription>Update your post with the new content</DialogDescription>
        </DialogHeader>
        <div className='space-y-4 overflow-x-hidden'>
          <PostEditor
            post={post}
            content={editorContent}
            onChangeContent={setEditorContent}
            isPrivate={isPrivate}
            onChangeIsPrivate={setIsPrivate}
          />
          <LoadingButton
            loading={isPending}
            onClick={handleEditPost}
            disabled={!editorContent}
            className='min-w-full'
          >
            Update
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
