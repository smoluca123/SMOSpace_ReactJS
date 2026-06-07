import { UUID } from 'crypto';
import { Button } from '@/components/ui/button';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrGetDirectRoomAPI } from '@/apis/chatApi';
import { activeChatRoomsQueryKey } from '@/modules/chat/components/Conversation/querys';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface IProps {
  userId: UUID;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
}

export default function MessageButton({ userId, className, variant = 'default' }: IProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['createDirectRoom', userId],
    mutationFn: async () => {
      const { data } = await createOrGetDirectRoomAPI({ userId });
      return data;
    },
    onSuccess: (room) => {
      if (room?.id) {
        queryClient.invalidateQueries({ queryKey: activeChatRoomsQueryKey });
        navigate(`/chat/${room.id}`);
      }
    },
    onError: (error) => {
      toast({
        title: 'Unable to open conversation',
        description: String(error),
        variant: 'destructive',
        duration: 3000,
      });
    },
  });

  return (
    <Button
      variant={variant}
      className={cn('gap-2', className)}
      onClick={() => mutate()}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className='w-4 h-4 animate-spin' />
      ) : (
        <MessageCircle className='h-4 w-4' />
      )}
      Message
    </Button>
  );
}
