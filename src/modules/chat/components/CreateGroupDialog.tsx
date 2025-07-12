'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import type { Participant } from '@/lib/types/chat';

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableUsers: Participant[];
  onCreateGroup: (name: string, participantIds: string[]) => void;
}

export function CreateGroupDialog({
  open,
  onOpenChange,
  availableUsers,
  onCreateGroup,
}: CreateGroupDialogProps) {
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const toggleParticipantSelection = (userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || selectedParticipants.length === 0) return;

    onCreateGroup(newGroupName, selectedParticipants);
    setNewGroupName('');
    setSelectedParticipants([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            placeholder='Group name'
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Select participants:</p>
            <ScrollArea className='h-48'>
              {availableUsers.map((user) => (
                <div
                  key={user.id}
                  className='flex items-center p-2 space-x-3 rounded-lg hover:bg-muted'
                >
                  <Checkbox
                    checked={selectedParticipants.includes(user.id)}
                    onCheckedChange={() => toggleParticipantSelection(user.id)}
                  />
                  <Avatar className='w-8 h-8'>
                    <AvatarImage src={user.avatar || '/placeholder.svg'} />
                    <AvatarFallback>
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>{user.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {user.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          <Button
            onClick={handleCreateGroup}
            disabled={!newGroupName.trim() || selectedParticipants.length === 0}
            className='w-full'
          >
            Create Group ({selectedParticipants.length} members)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
