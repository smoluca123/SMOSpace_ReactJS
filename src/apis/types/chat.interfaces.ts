import { IUserDataType } from '@/lib/types/interfaces';
import { IReactionType } from '@/lib/reactions';

export interface IChatRoomsDataType {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  type: 'GROUP' | 'DIRECT';
  name: string | null;
  lastMessage: {
    id: string;
    content: string;
    type?: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE' | 'SYSTEM' | 'POST_SHARE';
    createdAt: string;
    updatedAt: string;
    sender: IShortSenderDataType;
  } | null;
  participants: IRoomParticipantsDataType[];
  unreadCount?: number;
}

export interface IRoomParticipantsDataType {
  id: string;
  userId?: string;
  isMuted?: boolean;
  leftAt: null | string;
  joinedAt: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
}

// export interface IRoomMessageDataType {
//   id: string;
//   roomId: string;
//   senderId: string;
//   content: string;
//   type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
//   replyToId: null | string;
//   createdAt: string;
//   updatedAt: string;
//   readBy: string[];
//   sender: IRoomMessageSenderDataType;
//   replyTo: null | IRoomMessageDataType;
// }

interface IShortSenderDataType {
  id: string;
  username: string;
  displayName: null;
  avatar: string;
}

export interface IChatMessageReactionDataType {
  id: string;
  userId: string;
  type: IReactionType;
}

export interface IShareRecipientType {
  id: string;
  username: string;
  fullName: string;
  avatar: string | null;
}

export interface IRoomMessageDataType {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isForwarded?: boolean;
  sender: IUserDataType;
  readBy: string[];
  replyTo: null;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE' | 'SYSTEM' | 'POST_SHARE';
  room: IChatRoomsDataType;
  reactions: IChatMessageReactionDataType[];
}

/** Parsed JSON descriptor stored in a FILE message's content. */
export interface IChatFileContent {
  url: string;
  name: string;
  size: number;
  mime: string;
}

/** Parsed JSON descriptor stored in a VOICE message's content. */
export interface IChatVoiceContent {
  url: string;
  duration: number;
  size: number;
}

/** Client-side message with optimistic send status. */
export type ChatMessageSendStatus = 'sending' | 'failed';

export type IChatMessageUI = IRoomMessageDataType & {
  tempId?: string;
  status?: ChatMessageSendStatus;
};
