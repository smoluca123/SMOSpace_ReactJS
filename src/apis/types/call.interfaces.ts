export type CallTypeEnum = 'audio' | 'video';
export type CallStatus = 'missed' | 'ended';

export interface ICallParticipant {
  id: string;
  username: string;
  fullName: string;
  avatar: string | null;
}

export interface ICallHistoryItem {
  messageId: string;
  roomId: string;
  roomName: string | null;
  callType: CallTypeEnum;
  status: CallStatus;
  /** Duration in seconds (0 for missed calls). */
  duration: number;
  createdAt: string;
  participants: ICallParticipant[];
}

