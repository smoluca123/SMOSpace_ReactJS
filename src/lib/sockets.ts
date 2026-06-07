import {
  ICommentDataType,
  INotificationType,
  IPostDataWithLikedStatusType,
  IUserWithAccessTokenType,
} from '@/lib/types/interfaces';
import { io, Socket } from 'socket.io-client';
import env from './env';
import { UUID } from 'crypto';

// Define the interfaces for the namespaces
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ServerToClientEvents {
  // Add other events if needed
}

interface PostServerToClientEvents {
  'post:onNewPost': (post: IPostDataWithLikedStatusType) => void;
}

interface CommentServerToClientEvents {
  'comment:onNewComment': (comment: ICommentDataType) => void;
}

interface CommentClientToServerEvents {
  'comment:subscribeOnNewComment': ({ postId }: { postId: UUID }) => void;
}

interface NotificationServerToClientEvents {
  'noti:new': (notification: INotificationType) => void;
}

interface NotificationClientToServerEvents {
  'noti:subscribe': () => void;
}

export type UserPresenceStatus = 'online' | 'away' | 'busy' | 'offline';

export interface IUserPresenceUpdate {
  userId: string;
  status: UserPresenceStatus;
  isOnline: boolean;
}

interface UserServerToClientEvents {
  'user:presence:update': (data: IUserPresenceUpdate) => void;
  'user:online:list': (data: IUserPresenceUpdate[]) => void;
}

interface UserClientToServerEvents {
  'user:online': (data: { status?: Exclude<UserPresenceStatus, 'offline'> }) => void;
  'user:getOnline': () => void;
}

interface ChatServerToClientEvents {
  newMessage: (message: import('@/apis/types/chat.interfaces').IRoomMessageDataType) => void;
  'chat:newMessageNotification': (
    message: import('@/apis/types/chat.interfaces').IRoomMessageDataType,
  ) => void;
  typingStatus: (data: { roomId: string; typingUsers: string[] }) => void;
  messagesRead: (data: { roomId: string; userId: string }) => void;
}

interface ChatClientToServerEvents {
  'chat:subscribe': () => void;
  joinRoom: (data: { roomId: string }) => void;
  leaveRoom: (data: { roomId: string }) => void;
  sendMessage: (
    data: {
      roomId: string;
      content: string;
      type?: 'TEXT' | 'IMAGE' | 'FILE';
      replyToId?: string;
    },
    ack?: (response: import('@/apis/types/chat.interfaces').IRoomMessageDataType) => void,
  ) => void;
  typing: (data: { roomId: string; isTyping: boolean }) => void;
  markAsRead: (data: { roomId: string; messageIds: string[] }) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ClientToServerEvents {
  // Define events sent from client to server if needed
}

// Create socket instances for each namespace
export const createNamespaceSocket = <
  SE extends ServerToClientEvents,
  CE extends ClientToServerEvents,
>(
  namespace: string,
) => {
  // Read the freshest access token from localStorage. This must be evaluated
  // lazily (per-connection) rather than once at module load, otherwise the
  // socket keeps using a stale/empty token after the user logs out and back in
  // without a full page reload.
  const getAccessToken = () => {
    const currentUser = JSON.parse(
      localStorage.getItem('currentUser') || 'null',
    ) as IUserWithAccessTokenType | null;
    return currentUser?.accessToken || '';
  };

  return io(`${env.VITE_SOCKET_URL}/${namespace}`, {
    // `auth` as a function is re-evaluated on every (re)connection, so the
    // server always receives the current user's token.
    auth: (cb) => cb({ accessToken: getAccessToken(), token: getAccessToken() }),
    extraHeaders: {
      Authorization: `Bearer ${env.VITE_AUTHORIZATION_TOKEN}`,
      accessToken: getAccessToken(),
    },
    autoConnect: false,
  }) as Socket<SE, CE>;
};

// Create the concrete socket instances
export const postSocket = createNamespaceSocket<PostServerToClientEvents, ClientToServerEvents>(
  'post',
);
export const notificationSocket = createNamespaceSocket<
  NotificationServerToClientEvents,
  NotificationClientToServerEvents
>('notification');
export const commentSocket = createNamespaceSocket<
  CommentServerToClientEvents,
  CommentClientToServerEvents
>('comment');
export const userSocket = createNamespaceSocket<UserServerToClientEvents, UserClientToServerEvents>(
  'user',
);
// Add other namespaces if needed

export const chatSocket = createNamespaceSocket<ChatServerToClientEvents, ChatClientToServerEvents>(
  'chat',
);
