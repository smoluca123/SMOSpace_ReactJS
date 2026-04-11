import {
  IUserDataTypeWithFriendStatus,
  IUserDataWithFollowedStatusType,
} from '@/lib/types/interfaces';
import { Flag, LockKeyhole } from 'lucide-react';
import DropdownMenuItemWithIcon from '../DropdownMenuItemWithIcon';
import { AddFriendButton } from '@/components/FriendButtons';

interface IProps {
  user: IUserDataWithFollowedStatusType & IUserDataTypeWithFriendStatus;
}

export default function ProfileCardMenu({ user }: IProps) {
  return (
    <div className='space-y-2'>
      <AddFriendButton userId={user.id} userData={user} asMenuItem />
      <DropdownMenuItemWithIcon Icon={Flag}> Report profile</DropdownMenuItemWithIcon>
      <DropdownMenuItemWithIcon variant='destructive' Icon={LockKeyhole}>
        Block
      </DropdownMenuItemWithIcon>
    </div>
  );
}
