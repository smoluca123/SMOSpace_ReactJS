import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useGetMessageRequestCount } from '@/modules/chat/components/Conversation/requestQuerys';
import { ChevronRight, MailQuestion } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

/** Compact entry in the conversation list that opens the full requests view. */
export default function MessageRequests() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: count } = useGetMessageRequestCount();

  if (!count || count === 0) return null;

  return (
    <button
      onClick={() => navigate('/chat/requests')}
      className={cn(
        'flex gap-3 items-center px-3 py-3 w-full text-left border-b hover:bg-muted/50',
        id === 'requests' && 'bg-muted',
      )}
    >
      <div className='flex justify-center items-center w-10 h-10 rounded-full bg-primary/10'>
        <MailQuestion className='w-5 h-5 text-primary' />
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-semibold'>Message requests</p>
        <p className='text-xs text-muted-foreground'>{count} pending requests</p>
      </div>
      <Badge variant='default' className='flex justify-center items-center px-1.5 h-5 text-xs'>
        {count > 99 ? '99+' : count}
      </Badge>
      <ChevronRight className='w-4 h-4 text-muted-foreground' />
    </button>
  );
}
