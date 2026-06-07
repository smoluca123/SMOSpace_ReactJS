'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import UserAvatar from '@/components/UserAvatar';
import LoadingButton from '@/components/LoadingButton';
import { useGetMyFriendsQuery } from '@/modules/profile/components/Profile/ProfileContent/FriendList/querys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGroupChatAPI } from '@/apis/chatApi';
import { activeChatRoomsQueryKey } from '@/modules/chat/components/Conversation/querys';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroupDialog({ open, onOpenChange }: CreateGroupDialogProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetMyFriendsQuery();
  const friends = data?.pages.flatMap((page) => page.items) ?? [];

  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: () => createGroupChatAPI({ name: name.trim(), participantIds: selected }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: activeChatRoomsQueryKey });
      toast({ title: 'Group created', duration: 3000 });
      reset();
      onOpenChange(false);
      if (res.data?.id) navigate(`/chat/${res.data.id}`);
    },
    onError: (error) => {
      toast({
        title: 'Failed to create group',
        description: String(error),
        variant: 'destructive',
      });
    },
  });

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const reset = () => {
    setName('');
    setSelected([]);
  };

  const canCreate = name.trim().length > 0 && selected.length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Create group chat</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input placeholder='Group name' value={name} onChange={(e) => setName(e.target.value)} />
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Select members ({selected.length}):</p>
            <ScrollArea className='h-56'>
              {isPending && (
                <div className='flex justify-center py-6'>
                  <Loader2 className='animate-spin text-primary' />
                </div>
              )}
              {!isPending && friends.length === 0 && (
                <p className='py-6 text-sm text-center text-muted-foreground'>
                  You don't have any friends to add to the group yet.
                </p>
              )}
              {friends.map((friend) => (
                <label
                  key={friend.id}
                  className='flex items-center p-2 space-x-3 rounded-lg cursor-pointer hover:bg-muted'
                >
                  <Checkbox
                    checked={selected.includes(friend.id)}
                    onCheckedChange={() => toggle(friend.id)}
                  />
                  <UserAvatar
                    avatarUrl={friend.avatar}
                    fallbackName={friend.fullName}
                    className='w-8 h-8'
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>{friend.fullName}</p>
                    <p className='text-xs truncate text-muted-foreground'>@{friend.username}</p>
                  </div>
                </label>
              ))}
              {hasNextPage && (
                <Button
                  variant='ghost'
                  className='w-full'
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? 'Loading...' : 'Show more'}
                </Button>
              )}
            </ScrollArea>
          </div>
          <LoadingButton
            loading={isCreating}
            onClick={() => mutate()}
            disabled={!canCreate}
            className='w-full text-white'
          >
            Create group
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
