import {
  ICommentDataType,
  INotificationType,
  IPostDataWithLikedStatusType,
  IUserWithAccessTokenType,
} from '@/lib/types/interfaces';
import { io, Socket } from 'socket.io-client';
import env from './env';
import { UUID } from 'crypto';

// Định nghĩa interface cho các namespace
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ServerToClientEvents {
  // Thêm các event khác nếu cần
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ClientToServerEvents {
  // Định nghĩa các event từ client gửi lên server nếu cần
}

// Tạo các socket instances cho từng namespace
export const createNamespaceSocket = <
  SE extends ServerToClientEvents,
  CE extends ClientToServerEvents,
>(
  namespace: string,
) => {
  const currentUser = JSON.parse(
    localStorage.getItem('currentUser') || 'null',
  ) as IUserWithAccessTokenType | null;
  return io(`${env.VITE_SOCKET_URL}/${namespace}`, {
    extraHeaders: {
      Authorization: `Bearer ${env.VITE_AUTHORIZATION_TOKEN}`,
      accessToken: currentUser?.accessToken || '',
    },
    autoConnect: false,
  }) as Socket<SE, CE>;
};

// Tạo các socket instances cụ thể
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
// Thêm các namespace khác nếu cần
