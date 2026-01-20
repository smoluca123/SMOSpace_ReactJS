import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { IUserDataType, PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';
import { PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren, PropsWithClassName {
  userData: IUserDataType;
}

export default function NameWithBadge({ children, className, userData }: IProps) {
  return (
    <div className={cn('flex gap-x-1 items-center', className)}>
      {children}
      {userData.userType.typeName === 'SUPER_ADMIN' && <AdministratorBadge />}
    </div>
  );
}

type IAdministratorBadgeProps = PropsWithClassName;

function AdministratorBadge({ className }: IAdministratorBadgeProps) {
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <ShieldCheck className={cn('w-4 h-4 text-[#ce3df3]', className)} />
      </TooltipTrigger>
      <TooltipContent className='z-[9999] bg-secondary'>
        {/* <p className='text-[#ce3df3]'>Administrator</p> */}
        <div className='flex items-center justify-center'>
          <span className='box-content absolute flex mx-auto font-medium text-center text-transparent border select-none bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 to-pink-500 blur-xl w-fit'>
            Administrator
          </span>
          <h1 className='relative top-0 flex items-center justify-center h-auto font-medium text-center text-transparent select-auto bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 to-pink-500 w-fit'>
            Administrator
          </h1>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
