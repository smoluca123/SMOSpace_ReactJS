import { Ellipsis } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import {
  IUserDataTypeWithFriendStatus,
  IUserDataWithFollowedStatusType,
} from '@/lib/types/interfaces';
import ProfileCardMenu from './ProfileCardMenu';

interface IProps {
  user: IUserDataWithFollowedStatusType & IUserDataTypeWithFriendStatus;
}

export default function ProfileCardDropdownMenu({ user }: IProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' className='rounded-full text-foreground'>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='center' side='bottom'>
        <ProfileCardMenu user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
