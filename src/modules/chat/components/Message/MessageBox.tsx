import { IChatMessageUI, IChatRoomsDataType } from '@/apis/types/chat.interfaces';
import { IUserDataType } from '@/lib/types/interfaces';
import { ChatHeader } from '@/modules/chat/components/ChatHeader';
import MessageInput from '@/modules/chat/components/Message/MessageInput';
import MessageList from '@/modules/chat/components/Message/MessageList';
import { MessageSkeletons } from '@/modules/chat/components/Message/MessageSkeleton';
import { useGetRoomsMessagesQuery } from '@/modules/chat/components/Message/querys';
import { useChatSocket } from '@/modules/chat/hooks/useChatSocket';
import {
  useAcceptMessageRequest,
  useRejectMessageRequest,
} from '@/modules/chat/components/Conversation/requestQuerys';
import LoadingButton from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useGetUserInfomation } from '@/lib/querys';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { ArrowLeft, Lock, ShieldBan } from 'lucide-react';
import { useMemo, useOptimistic, useState, useTransition } from 'react';

export default function MessageBox({
  room,
  activeConversationId,
  onBack,
}: {
  room: IChatRoomsDataType | undefined;
  activeConversationId: string;
  onBack?: () => void;
}) {
  const { user } = useAppSelector(selectAuth);
  const { data, isFetching, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetRoomsMessagesQuery({ roomId: activeConversationId });

  // A pending request waiting for MY approval (the other person started it)
  const isPendingForMe = room?.status === 'PENDING' && room?.lastMessage?.sender.id !== user?.id;

  const { sendMessage, setTyping, typingUsers, reactToMessage } = useChatSocket({
    roomId: activeConversationId,
    autoMarkRead: !isPendingForMe,
    // Don't try to join / mark-as-read a room we have no access to
    enabled: !isError,
  });

  const acceptRequest = useAcceptMessageRequest();
  const rejectRequest = useRejectMessageRequest();

  const isGroup = room?.type === 'GROUP';

  // For direct rooms, resolve the other participant so we can detect a block
  // relationship (either direction) and gate the composer accordingly.
  const directReceiver =
    room && !isGroup ? room.participants.find((p) => p.user.id !== user?.id) : undefined;

  const { data: directReceiverInfo } = useGetUserInfomation(
    { userId: directReceiver?.user.id ?? '' },
    { enabled: !!directReceiver?.user.id },
  );

  const blockFriend = directReceiverInfo?.friend;
  const isBlocked = blockFriend?.status === 'BLOCKED';
  // The block row stores the blocker in `userId`. If that's me, I blocked them;
  // otherwise they blocked me.
  const isBlockedByMe = isBlocked && blockFriend?.userId === user?.id;

  const blockReceiverName =
    directReceiver?.user.fullName || directReceiver?.user.username || 'this user';

  const serverMessages = useMemo<IChatMessageUI[]>(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  // Messages that failed to send stay in the list until retried/dismissed
  const [failedMessages, setFailedMessages] = useState<IChatMessageUI[]>([]);

  const baseMessages = useMemo<IChatMessageUI[]>(
    () => [...serverMessages, ...failedMessages],
    [serverMessages, failedMessages],
  );

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    baseMessages,
    (state, message: IChatMessageUI) => [...state, message],
  );
  const [, startTransition] = useTransition();

  // Server returns newest-first; display oldest -> newest (newest at the bottom)
  const displayMessages = [...optimisticMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const buildOptimistic = (content: string): IChatMessageUI => {
    const tempId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `temp-${Date.now()}`;
    const now = new Date().toISOString();
    return {
      id: tempId,
      tempId,
      content,
      type: 'TEXT',
      createdAt: now,
      updatedAt: now,
      sender: user as unknown as IUserDataType,
      readBy: user ? [user.id] : [],
      replyTo: null,
      reactions: [],
      room: undefined as unknown as IChatRoomsDataType,
      status: 'sending',
    };
  };

  const handleSend = (content: string) => {
    if (!user) return;
    const optimistic = buildOptimistic(content);

    startTransition(async () => {
      addOptimisticMessage(optimistic);
      try {
        await sendMessage(content);
        // success: the real message arrives via the socket and lands in cache,
        // so the optimistic one is replaced automatically once the transition ends.
      } catch {
        setFailedMessages((prev) => [...prev, { ...optimistic, status: 'failed' }]);
      }
    });
  };

  const handleRetry = (message: IChatMessageUI) => {
    setFailedMessages((prev) => prev.filter((m) => m.tempId !== message.tempId));
    handleSend(message.content);
  };

  const handleDismissFailed = (message: IChatMessageUI) => {
    setFailedMessages((prev) => prev.filter((m) => m.tempId !== message.tempId));
  };

  const handleAccept = () => {
    acceptRequest.mutate(
      { roomId: activeConversationId },
      { onSuccess: () => toast({ title: 'Message request accepted', duration: 2500 }) },
    );
  };

  const handleReject = () => {
    rejectRequest.mutate(
      { roomId: activeConversationId },
      {
        onSuccess: () => {
          toast({ title: 'Message request rejected', duration: 2500 });
          onBack?.();
        },
      },
    );
  };

  if (!activeConversationId) return null;

  // The user navigated to a room they cannot access (not a participant, or
  // the room doesn't exist). Show a friendly fallback instead of an empty
  // message list and a broken composer.
  if (isError) {
    return (
      <div className='flex flex-col flex-1'>
        <div className='flex gap-3 items-center p-3 border-b'>
          {onBack && (
            <Button variant='ghost' size='icon' onClick={onBack} aria-label='Back'>
              <ArrowLeft className='w-5 h-5' />
            </Button>
          )}
          <span className='font-medium'>Conversation</span>
        </div>
        <div className='flex flex-col flex-1 gap-3 justify-center items-center px-6 text-center text-muted-foreground'>
          <Lock className='w-10 h-10' />
          <div>
            <p className='font-medium text-foreground'>Can't open this conversation</p>
            <p className='mt-1 text-sm'>
              This conversation doesn't exist or you don't have access to it.
            </p>
          </div>
          {onBack && (
            <Button onClick={onBack} variant='outline'>
              Go back
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col flex-1'>
      <ChatHeader
        room={room}
        typingUsers={typingUsers}
        onBack={onBack}
        onToggleParticipants={() => {}}
      />

      {isFetching && optimisticMessages.length === 0 ? (
        <MessageSkeletons />
      ) : (
        <MessageList
          key={activeConversationId}
          messages={displayMessages}
          isGroup={isGroup}
          onRetry={handleRetry}
          onDismiss={handleDismissFailed}
          onReact={(messageId, type) => reactToMessage(messageId, type, user?.id)}
          hasMore={!!hasNextPage}
          isLoadingMore={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      )}

      {isPendingForMe ? (
        <div className='p-4 border-t bg-card'>
          <p className='mb-3 text-sm text-center text-muted-foreground'>
            Do you want to receive messages from this person?
          </p>
          <div className='flex gap-2'>
            <LoadingButton
              variant='outline'
              className='flex-1'
              loading={rejectRequest.isPending}
              onClick={handleReject}
            >
              Decline
            </LoadingButton>
            <LoadingButton
              className='flex-1 text-white'
              loading={acceptRequest.isPending}
              onClick={handleAccept}
            >
              Accept
            </LoadingButton>
          </div>
        </div>
      ) : isBlocked ? (
        <div className='flex flex-col gap-2 items-center p-4 border-t text-center bg-card text-muted-foreground'>
          <ShieldBan className='w-6 h-6' />
          <p className='text-sm'>
            {isBlockedByMe
              ? `You blocked ${blockReceiverName}. Unblock them to send messages.`
              : `You can't send messages to ${blockReceiverName}.`}
          </p>
        </div>
      ) : (
        <MessageInput
          isGroup={isGroup}
          roomId={activeConversationId}
          onSendMessage={handleSend}
          onTyping={setTyping}
        />
      )}
    </div>
  );
}
