import {
  IUserDataTypeWithFriendStatus,
  IUserDataWithFollowedStatusType,
} from '@/lib/types/interfaces';
import { Flag } from 'lucide-react';
import DropdownMenuItemWithIcon from '../DropdownMenuItemWithIcon';
import { AddFriendButton } from '@/components/FriendButtons';
import BlockMenuItem from '@/modules/profile/components/Profile/ProfileHeader/ProfileActions/BlockMenuItem';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

interface IProps {
  user: IUserDataWithFollowedStatusType & IUserDataTypeWithFriendStatus;
}

export default function ProfileCardMenu({ user }: IProps) {
  const { user: currentUser } = useAppSelector(selectAuth);

  const isBlocked = user.friend?.status === 'BLOCKED';
  const isBlockedByMe = isBlocked && user.friend?.userId === currentUser?.id;

  return (
    <div className='space-y-2'>
      {!isBlocked && <AddFriendButton userId={user.id} userData={user} asMenuItem />}

      <DropdownMenuItemWithIcon Icon={Flag}> Report profile</DropdownMenuItemWithIcon>

      {(!isBlocked || isBlockedByMe) && (
        <BlockMenuItem userId={user.id} friend={user.friend} fullName={user.fullName} />
      )}
    </div>
  );
}
