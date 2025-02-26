import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import { Flag, LockKeyhole, UserPlus } from 'lucide-react';
import DropdownMenuItemWithIcon from '../DropdownMenuItemWithIcon';

interface IProps {
  user: IUserDataWithFollowedStatusType;
}

export default function ProfileCardMenu({ user }: IProps) {
  console.log(user);

  return (
    <div className='space-y-2'>
      <DropdownMenuItemWithIcon Icon={UserPlus}>Add friend</DropdownMenuItemWithIcon>
      <DropdownMenuItemWithIcon Icon={Flag}> Report profile</DropdownMenuItemWithIcon>
      <DropdownMenuItemWithIcon variant='destructive' Icon={LockKeyhole}>
        Block
      </DropdownMenuItemWithIcon>
    </div>
  );
}
