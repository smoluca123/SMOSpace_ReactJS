import { UUID } from 'crypto';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface IProps {
  userId: UUID;
}

export default function MessageButton({ userId }: IProps) {
  const handleMessage = () => {
    // TODO: Navigate to messages page or open chat dialog
    // Example: router.push(`/messages/${userId}`)
    console.log('Open message:', userId);
  };

  return (
    <Button variant='default' className='gap-2' onClick={handleMessage}>
      <MessageCircle className='h-4 w-4' />
      Nhắn tin
    </Button>
  );
}
