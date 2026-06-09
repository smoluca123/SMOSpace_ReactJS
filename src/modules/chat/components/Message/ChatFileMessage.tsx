import { IChatFileContent } from '@/apis/types/chat.interfaces';
import { cn } from '@/lib/utils';
import { Download, FileText } from 'lucide-react';

function formatSize(bytes: number) {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}

/**
 * Renders a FILE chat message as a downloadable card. The message content is a
 * JSON descriptor `{ url, name, size, mime }`.
 */
export default function ChatFileMessage({
  content,
  isSender,
}: {
  content: string;
  isSender: boolean;
}) {
  let file: IChatFileContent | null = null;
  try {
    file = JSON.parse(content);
  } catch {
    file = null;
  }

  if (!file?.url) {
    return (
      <div className='px-4 py-2 text-sm rounded-2xl bg-muted text-muted-foreground'>
        Unsupported file
      </div>
    );
  }

  return (
    <a
      href={file.url}
      target='_blank'
      rel='noopener noreferrer'
      download={file.name}
      className={cn(
        'flex items-center gap-3 rounded-2xl px-3 py-2 max-w-[16rem] transition-colors',
        isSender ? 'bg-primary text-primary-foreground' : 'bg-muted',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg shrink-0',
          isSender ? 'bg-primary-foreground/20' : 'bg-background',
        )}
      >
        <FileText className='w-5 h-5' />
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium truncate'>{file.name}</p>
        <p
          className={cn(
            'text-xs',
            isSender ? 'text-primary-foreground/80' : 'text-muted-foreground',
          )}
        >
          {formatSize(file.size)}
        </p>
      </div>
      <Download className='w-4 h-4 shrink-0' />
    </a>
  );
}
