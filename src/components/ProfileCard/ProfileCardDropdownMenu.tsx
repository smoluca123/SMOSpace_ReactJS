import { Ellipsis } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import ProfileCardMenu from './ProfileCardMenu';

interface IProps {
  user: IUserDataWithFollowedStatusType;
}

export default function ProfileCardDropdownMenu({ user }: IProps) {
  return (
    <DropdownMenu>
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
