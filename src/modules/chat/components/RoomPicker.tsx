import { IChatRoomsDataType } from '@/apis/types/chat.interfaces';
import UserAvatar from '@/components/UserAvatar';
import { Checkbox } from '@/components/ui/checkbox';
import { useGetActiveChatRoomsQuery } from '@/modules/chat/components/Conversation/querys';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { Loader2, Users } from 'lucide-react';

/**
 * Multi-select list of the user's active chat rooms. Controlled via
 * `selectedRoomIds` / `onToggle`. Reused by the "forward message" and
 * "share post to chat" dialogs.
 */
export default function RoomPicker({
  selectedRoomIds,
  onToggle,
}: {
  selectedRoomIds: string[];
  onToggle: (roomId: string) => void;
}) {
  const { user } = useAppSelector(selectAuth);
  const { data, isLoading } = useGetActiveChatRoomsQuery();

  const rooms = data?.pages.flatMap((page) => page.items) ?? [];

  if (isLoading) {
    return (
      <div className='flex justify-center py-6'>
        <Loader2 className='w-5 h-5 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <p className='py-6 text-sm text-center text-muted-foreground'>
        You have no conversations yet.
      </p>
    );
  }

  const roomLabel = (room: IChatRoomsDataType) => {
    if (room.type === 'GROUP') return room.name || 'Group chat';
    const other = room.participants.find((p) => p.user.id !== user?.id);
    return other?.user.fullName || other?.user.username || 'Conversation';
  };

  const roomAvatar = (room: IChatRoomsDataType) =>
    room.type === 'GROUP'
      ? undefined
      : room.participants.find((p) => p.user.id !== user?.id)?.user.avatar;

  return (
    <div className='max-h-[320px] overflow-y-auto space-y-1'>
      {rooms.map((room) => {
        const checked = selectedRoomIds.includes(room.id);
        return (
          <label
            key={room.id}
            className='flex gap-3 items-center p-2 rounded-lg cursor-pointer hover:bg-muted/50'
          >
            <Checkbox checked={checked} onCheckedChange={() => onToggle(room.id)} />
            {room.type === 'GROUP' ? (
              <div className='flex justify-center items-center w-9 h-9 rounded-full bg-muted'>
                <Users className='w-4 h-4 text-muted-foreground' />
              </div>
            ) : (
              <UserAvatar
                avatarUrl={roomAvatar(room)}
                fallbackName={roomLabel(room)}
                className='w-9 h-9'
              />
            )}
            <span className='flex-1 text-sm font-medium truncate'>{roomLabel(room)}</span>
          </label>
        );
      })}
    </div>
  );
}
