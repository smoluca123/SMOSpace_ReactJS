/**
 * Call summary messages are stored as SYSTEM chat messages whose `content` is a
 * JSON descriptor. These helpers parse and present them consistently across the
 * message thread and the conversation list preview.
 */
export interface CallMessageData {
  kind: 'call';
  callType: 'audio' | 'video';
  status: 'missed' | 'ended';
  /** Duration in seconds (0 for missed calls). */
  duration: number;
}

export function parseCallMessage(content: string): CallMessageData | null {
  try {
    const parsed = JSON.parse(content);
    if (parsed && parsed.kind === 'call') return parsed as CallMessageData;
  } catch {
    /* not a call descriptor */
  }
  return null;
}

/** Format seconds as m:ss (or h:mm:ss for long calls). */
export function formatCallDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Short label for the conversation list preview. */
export function callPreviewText(data: CallMessageData): string {
  if (data.status === 'missed') {
    return data.callType === 'video' ? 'Missed video call' : 'Missed call';
  }
  return data.callType === 'video' ? 'Video call' : 'Voice call';
}
