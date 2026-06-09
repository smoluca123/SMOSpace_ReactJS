import { sharePostToChatAPI } from '@/apis/chatApi';
import { IShareRecipientType } from '@/apis/types/chat.interfaces';
import LoadingButton from '@/components/LoadingButton';
import SharedPostEmbed from '@/components/Posts/SharedPostEmbed';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { usePostContext } from '@/hooks/usePostContext';
import { activeChatRoomsQueryKey } from '@/modules/chat/components/Conversation/querys';
import RecipientPicker from '@/modules/chat/components/RecipientPicker';
import { unreadChatCountQueryKey } from '@/modules/chat/querys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * Send a post into chats. Lists people the user can message (friends,
 * followings, existing chats) to pick recipients, then creates a POST_SHARE
 * message in each resolved direct room.
 */
export default function SharePostToChatDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { post } = usePostContext();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const embeddedPost = post.sharedPost ?? post;

  const { mutate, isPending } = useMutation({
    mutationFn: () => sharePostToChatAPI({ postId: post.id, userIds: selectedUserIds }),
    onSuccess: () => {
      toast({ description: 'Post sent', duration: 2500 });
      // Refresh the conversation list so the targeted chats show the new
      // last message right away.
      queryClient.invalidateQueries({ queryKey: activeChatRoomsQueryKey });
      queryClient.invalidateQueries({ queryKey: unreadChatCountQueryKey });
      setSelectedUserIds([]);
      onClose();
    },
    onError: (error) =>
      toast({
        variant: 'destructive',
        description: typeof error === 'string' ? error : 'Failed to send post',
      }),
  });

  const toggle = (user: IShareRecipientType) =>
    setSelectedUserIds((prev) =>
      prev.includes(user.id) ? prev.filter((id) => id !== user.id) : [...prev, user.id],
    );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Send in message</DialogTitle>
          <DialogDescription>Share this post with friends and people you follow</DialogDescription>
        </DialogHeader>
        <Separator />

        {/* Preview */}
        <div className='max-h-[180px] overflow-y-auto'>
          <SharedPostEmbed post={embeddedPost} preview />
        </div>

        <RecipientPicker selectedUserIds={selectedUserIds} onToggle={toggle} />

        <div className='flex justify-end'>
          <LoadingButton
            loading={isPending}
            disabled={selectedUserIds.length === 0}
            onClick={() => mutate()}
          >
            Send
            {selectedUserIds.length > 0 && ` (${selectedUserIds.length})`}
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
