import { IChatRoomsDataType } from '@/apis/types/chat.interfaces';
import { Button } from '@/components/ui/button';
import LoadingButton from '@/components/LoadingButton';
import UserAvatar from '@/components/UserAvatar';
import { toast } from '@/hooks/use-toast';
import { formatLastMessageTime } from '@/lib/utils/chat-utils';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import {
  useAcceptMessageRequest,
  useGetMessageRequests,
  useRejectMessageRequest,
} from '@/modules/chat/components/Conversation/requestQuerys';
import { ArrowLeft, Loader2, MailQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MessageRequestsView() {
  const { user } = useAppSelector(selectAuth);
  const navigate = useNavigate();
  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetMessageRequests();
  const accept = useAcceptMessageRequest();
  const reject = useRejectMessageRequest();

  const requests = data?.pages.flatMap((page) => page.items) ?? [];
  const total = data?.pages[0]?.totalCount ?? 0;

  const handleAccept = (roomId: string) =>
    accept.mutate(
      { roomId },
      {
        onSuccess: () => {
          toast({ title: 'Message request accepted', duration: 2500 });
          navigate(`/chat/${roomId}`);
        },
      },
    );

  const handleReject = (roomId: string) =>
    reject.mutate(
      { roomId },
      { onSuccess: () => toast({ title: 'Message request rejected', duration: 2500 }) },
    );

  return (
    <div className='flex flex-col flex-1 h-full'>
      {/* Header */}
      <div className='flex gap-3 items-center p-4 border-b bg-card'>
        <Button variant='ghost' size='icon' className='lg:hidden' onClick={() => navigate('/chat')}>
          <ArrowLeft className='w-5 h-5' />
        </Button>
        <MailQuestion className='w-5 h-5 text-primary' />
        <h2 className='text-lg font-semibold'>Message requests {total > 0 && `(${total})`}</h2>
      </div>

      {/* List */}
      <div className='overflow-y-auto flex-1 p-3 space-y-2'>
        {isPending && (
          <div className='flex justify-center py-10'>
            <Loader2 className='animate-spin text-primary' />
          </div>
        )}

        {!isPending && requests.length === 0 && (
          <div className='flex flex-col gap-2 justify-center items-center py-16 text-muted-foreground'>
            <MailQuestion className='w-10 h-10' />
            <p>No pending message requests</p>
          </div>
        )}

        {requests.map((room: IChatRoomsDataType) => {
          const sender = room.participants.find((p) => p.user.id !== user?.id)?.user;
          const isBusy =
            (accept.isPending && accept.variables?.roomId === room.id) ||
            (reject.isPending && reject.variables?.roomId === room.id);
          return (
            <div key={room.id} className='p-3 rounded-lg border border-border'>
              <div
                className='flex gap-3 items-center cursor-pointer'
                onClick={() => navigate(`/chat/${room.id}`)}
              >
                <UserAvatar
                  avatarUrl={sender?.avatar}
                  fallbackName={sender?.fullName}
                  className='w-12 h-12'
                />
                <div className='flex-1 min-w-0'>
                  <div className='flex justify-between items-center'>
                    <p className='font-medium truncate'>{sender?.fullName}</p>
                    {room.lastMessage && (
                      <span className='text-xs text-muted-foreground'>
                        {formatLastMessageTime(new Date(room.lastMessage.createdAt))}
                      </span>
                    )}
                  </div>
                  <p className='text-sm truncate text-muted-foreground'>
                    {room.lastMessage?.type === 'IMAGE'
                      ? 'Sent an image'
                      : room.lastMessage?.content}
                  </p>
                </div>
              </div>

              <div className='flex gap-2 mt-3'>
                <LoadingButton
                  variant='outline'
                  className='flex-1'
                  loading={reject.isPending && reject.variables?.roomId === room.id}
                  disabled={isBusy}
                  onClick={() => handleReject(room.id)}
                >
                  Decline
                </LoadingButton>
                <LoadingButton
                  className='flex-1 text-white'
                  loading={accept.isPending && accept.variables?.roomId === room.id}
                  disabled={isBusy}
                  onClick={() => handleAccept(room.id)}
                >
                  Accept
                </LoadingButton>
              </div>
            </div>
          );
        })}

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
      </div>
    </div>
  );
}
