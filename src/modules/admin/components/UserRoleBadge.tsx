import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Star, User } from 'lucide-react';

export default function UserRoleBadge({
  role,
}: {
  role: IUserDataWithFollowedStatusType['userType']['typeName'];
}) {
  switch (role) {
    case 'Administrator':
      return (
        <Badge variant='secondary'>
          <ShieldCheck className=' size-3' />
          <div className='flex items-center justify-center w-full h-full rounded-md bg-secondary'>
            <span className='box-content absolute flex mx-auto font-medium text-center text-transparent border select-none bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 to-pink-500 blur-xl w-fit'>
              Administrator
            </span>
            <h1 className='relative top-0 flex items-center justify-center h-auto font-medium text-center text-transparent select-auto bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 to-pink-500 w-fit'>
              Administrator
            </h1>
          </div>
        </Badge>
      );
    case 'Manager':
      return (
        <Badge variant='default'>
          <ShieldCheck className='w-3 h-3' />
          Manager
        </Badge>
      );
    case 'VIP Member':
      return (
        <Badge variant='default'>
          <Star className=' size-3' />
          VIP Member
        </Badge>
      );
    case 'Member':
      return (
        <Badge variant='secondary'>
          <User className=' size-3' />
          Member
        </Badge>
      );
    default:
      return null;
  }
}
