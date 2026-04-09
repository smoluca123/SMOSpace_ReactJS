import { UUID } from 'crypto';
import { ShieldBan } from 'lucide-react';
import DropdownMenuItemWithIcon from '@/components/DropdownMenuItemWithIcon';
import { useState } from 'react';

interface IProps {
  userId: UUID;
}

export default function BlockMenuItem({ userId }: IProps) {
  const [isBlocking, setIsBlocking] = useState(false);

  const handleBlock = async () => {
    setIsBlocking(true);
    try {
      // TODO: Call API to block user
      console.log('Block user:', userId);
    } catch (error) {
      console.error('Failed to block user:', error);
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <DropdownMenuItemWithIcon
      Icon={ShieldBan}
      onClick={handleBlock}
      variant='destructive'
      onSelect={(e) => e.preventDefault()}
      disabled={isBlocking}
    >
      {isBlocking ? 'Đang chặn...' : 'Chặn'}
    </DropdownMenuItemWithIcon>
  );
}
