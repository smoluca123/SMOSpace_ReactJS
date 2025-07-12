export interface Participant {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isTyping: boolean;
}

export interface MessageStatus {
  sent: boolean;
  delivered: boolean;
  deliveredTo: string[];
  readBy: string[];
  timestamp: {
    sent?: Date;
    delivered?: Date;
    read?: Date;
  };
}

export interface Message {
  id: string;
  text?: string;
  image?: string;
  timestamp: Date;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  reactions?: { emoji: string; users: string[]; count: number }[];
  status?: MessageStatus;
}

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isGroup: boolean;
  participants: Participant[];
  createdBy?: string;
  description?: string;
}
