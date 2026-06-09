import { forwardMessageAPI } from '@/apis/chatApi';
import LoadingButton from '@/components/LoadingButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { activeChatRoomsQueryKey } from '@/modules/chat/components/Conversation/querys';
import RoomPicker from '@/modules/chat/components/RoomPicker';
import { unreadChatCountQueryKey } from '@/modules/chat/querys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function ForwardMessageDialog({
  messageId,
  open,
  onClose,
}: {
  messageId: string;
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => forwardMessageAPI({ messageId, roomIds: selectedRoomIds }),
    onSuccess: () => {
      toast({ description: 'Message forwarded', duration: 2500 });
      // Refresh the conversation list so forwarded-to rooms show the new last
      // message (the sender doesn't receive their own message notification).
      queryClient.invalidateQueries({ queryKey: activeChatRoomsQueryKey });
      queryClient.invalidateQueries({ queryKey: unreadChatCountQueryKey });
      setSelectedRoomIds([]);
      onClose();
    },
    onError: (error) =>
      toast({
        variant: 'destructive',
        description: typeof error === 'string' ? error : 'Failed to forward message',
      }),
  });

  const toggle = (roomId: string) =>
    setSelectedRoomIds((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId],
    );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Forward message</DialogTitle>
          <DialogDescription>Choose conversations to forward this message to</DialogDescription>
        </DialogHeader>
        <Separator />

        <RoomPicker selectedRoomIds={selectedRoomIds} onToggle={toggle} />

        <div className='flex justify-end'>
          <LoadingButton
            loading={isPending}
            disabled={selectedRoomIds.length === 0}
            onClick={() => mutate()}
          >
            Forward
            {selectedRoomIds.length > 0 && ` (${selectedRoomIds.length})`}
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
