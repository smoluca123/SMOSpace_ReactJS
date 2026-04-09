import { UUID } from 'crypto';
import { Users } from 'lucide-react';
import DropdownMenuItemWithIcon from '@/components/DropdownMenuItemWithIcon';

interface IProps {
  userId: UUID;
}

export default function EditFriendListMenuItem({ userId }: IProps) {
  const handleEditFriendList = () => {
    // TODO: Open edit friend list dialog/modal
    console.log('Edit friend list:', userId);
  };

  return (
    <DropdownMenuItemWithIcon
      Icon={Users}
      onClick={handleEditFriendList}
      onSelect={(e) => e.preventDefault()}
    >
      Chỉnh sửa danh sách bạn bè
    </DropdownMenuItemWithIcon>
  );
}
