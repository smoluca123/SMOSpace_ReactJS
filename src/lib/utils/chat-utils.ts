// Assuming Conversation is declared in a types file

import { Conversation } from '@/lib/types/chat';

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatLastMessageTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
};

export const getTypingUsers = (conversation: Conversation) => {
  const typingUsers = conversation.participants.filter((p) => p.isTyping);
  if (typingUsers.length === 0) return null;
  if (typingUsers.length === 1) return `${typingUsers[0].name} is typing...`;
  if (typingUsers.length === 2)
    return `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`;
  return `${typingUsers.length} people are typing...`;
};

export const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];
