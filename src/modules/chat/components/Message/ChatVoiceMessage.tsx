import { IChatVoiceContent } from '@/apis/types/chat.interfaces';
import { cn } from '@/lib/utils';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function formatDuration(seconds: number) {
  if (!seconds || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Renders a VOICE chat message as a compact audio player. The message content
 * is a JSON descriptor `{ url, duration, size }`.
 */
export default function ChatVoiceMessage({
  content,
  isSender,
}: {
  content: string;
  isSender: boolean;
}) {
  let voice: IChatVoiceContent | null = null;
  try {
    voice = JSON.parse(content);
  } catch {
    voice = null;
  }

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(voice?.duration ?? 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrent(audio.currentTime);
    const onMeta = () => {
      if (Number.isFinite(audio.duration)) setTotal(audio.duration);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrent(0);
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  if (!voice?.url) {
    return (
      <div className='px-4 py-2 text-sm rounded-2xl bg-muted text-muted-foreground'>
        Unsupported audio
      </div>
    );
  }

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const progress = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  const display = isPlaying || current > 0 ? current : total;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl px-3 py-2 w-56',
        isSender ? 'bg-primary text-primary-foreground' : 'bg-muted',
      )}
    >
      <button
        type='button'
        onClick={toggle}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-full shrink-0',
          isSender ? 'bg-primary-foreground/20' : 'bg-background',
        )}
      >
        {isPlaying ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
      </button>

      <div className='flex-1 min-w-0'>
        <div
          className={cn(
            'h-1.5 rounded-full overflow-hidden',
            isSender ? 'bg-primary-foreground/30' : 'bg-foreground/15',
          )}
        >
          <div
            className={cn('h-full rounded-full', isSender ? 'bg-primary-foreground' : 'bg-primary')}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span
          className={cn(
            'text-xs',
            isSender ? 'text-primary-foreground/80' : 'text-muted-foreground',
          )}
        >
          {formatDuration(display)}
        </span>
      </div>

      <audio ref={audioRef} src={voice.url} preload='metadata' className='hidden' />
    </div>
  );
}
