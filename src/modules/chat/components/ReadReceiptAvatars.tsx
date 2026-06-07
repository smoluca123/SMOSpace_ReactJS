'use client';

import UserAvatar from '@/components/UserAvatar';
import { IRoomMessageDataType } from '@/apis/types/chat.interfaces';

interface ReadReceiptAvatarsProps {
  message: IRoomMessageDataType;
  currentUserId?: string;
}

export function ReadReceiptAvatars({ message, currentUserId }: ReadReceiptAvatarsProps) {
  // Only show read receipts under your own messages
  if (message.sender.id !== currentUserId) return null;

  const participants = message.room?.participants || [];
  const readers = participants.filter(
    (p) => p.user.id !== currentUserId && message.readBy.includes(p.user.id),
  );

  if (readers.length === 0) return null;

  const maxAvatars = 3;
  const overflow = readers.length - maxAvatars;

  return (
    <div className='flex items-center mt-1 -mb-1'>
      <div className='flex -space-x-1'>
        {readers.slice(0, maxAvatars).map((p) => (
          <span key={p.id} title={`Seen by ${p.user.fullName}`} className='inline-flex'>
            <UserAvatar
              avatarUrl={p.user.avatar}
              fallbackName={p.user.fullName}
              className='w-4 h-4 ring-1 ring-background'
            />
          </span>
        ))}
        {overflow > 0 && (
          <div className='flex justify-center items-center w-4 h-4 rounded-full ring-1 bg-muted ring-background'>
            <span className='text-[8px] font-medium text-muted-foreground'>+{overflow}</span>
          </div>
        )}
      </div>
    </div>
  );
}
