import { useState } from 'react';
import { UserMinus } from 'lucide-react';
import DropdownMenuItemWithIcon from '@/components/DropdownMenuItemWithIcon';
import DeleteFriendDialog from '@/components/FriendButtons/DeleteFriendButton/DeleteFriendDialog';
import { IUserDataType } from '@/lib/types/interfaces';

interface IProps {
  userData: IUserDataType;
}

export default function UnfriendMenuItem({ userData }: IProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DropdownMenuItemWithIcon
        Icon={UserMinus}
        variant='destructive'
        onClick={() => setIsOpen(true)}
        onSelect={(e) => e.preventDefault()}
      >
        Unfriend
      </DropdownMenuItemWithIcon>
      <DeleteFriendDialog userData={userData} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
