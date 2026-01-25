import { UUID } from 'crypto';
import { UserMinus } from 'lucide-react';
import DropdownMenuItemWithIcon from '@/components/DropdownMenuItemWithIcon';

interface IProps {
  userId: UUID;
}

export default function UnfriendMenuItem({ userId }: IProps) {
  const handleUnfriend = () => {
    // TODO: Call API to unfriend user
    console.log('Unfriend:', userId);
  };

  return (
    <DropdownMenuItemWithIcon
      Icon={UserMinus}
      onClick={handleUnfriend}
      onSelect={(e) => e.preventDefault()}
    >
      Hủy kết bạn
    </DropdownMenuItemWithIcon>
  );
}
