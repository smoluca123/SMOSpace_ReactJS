import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Star, User } from 'lucide-react';

export default function UserRoleBadge({
  role,
}: {
  role: IUserDataWithFollowedStatusType['userType']['typeName'];
}) {
  switch (role) {
    case 'SUPER_ADMIN':
      return (
        <Badge variant='secondary'>
          <ShieldCheck className='size-3' />
          <div className='flex justify-center items-center w-full h-full rounded-md bg-secondary'>
            <span className='box-content flex absolute mx-auto font-medium text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 to-pink-500 border blur-xl select-none w-fit'>
              Administrator
            </span>
            <h1 className='flex relative top-0 justify-center items-center h-auto font-medium text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 to-pink-500 select-auto w-fit'>
              Administrator
            </h1>
          </div>
        </Badge>
      );
    case 'MODERATOR':
      return (
        <Badge variant='default'>
          <ShieldCheck className='w-3 h-3' />
          Manager
        </Badge>
      );
    case 'VIP_USER':
      return (
        <Badge variant='default'>
          <Star className='size-3' />
          VIP Member
        </Badge>
      );
    case 'USER':
      return (
        <Badge variant='secondary'>
          <User className='size-3' />
          Member
        </Badge>
      );
    default:
      return null;
  }
}
