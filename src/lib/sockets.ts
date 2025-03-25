import { ICommentDataType, IPostDataWithLikedStatusType } from '@/lib/types/interfaces';
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
  return io(`${env.VITE_SOCKET_URL}/${namespace}`, {
    extraHeaders: {
      Authorization: `Bearer ${env.VITE_AUTHORIZATION_TOKEN}`,
    },
    autoConnect: false,
  }) as Socket<SE, CE>;
};

// Tạo các socket instances cụ thể
export const postSocket = createNamespaceSocket<PostServerToClientEvents, ClientToServerEvents>(
  'post',
);
export const notificationSocket = createNamespaceSocket<ServerToClientEvents, ClientToServerEvents>(
  'notifications',
);
export const commentSocket = createNamespaceSocket<
  CommentServerToClientEvents,
  CommentClientToServerEvents
>('comment');
// Thêm các namespace khác nếu cần
