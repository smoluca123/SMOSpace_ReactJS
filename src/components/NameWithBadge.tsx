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
      {userData.userType.typeName === 'Administrator' && <AdministratorBadge />}
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
      <TooltipContent className='bg-secondary'>
        {/* <p className='text-[#ce3df3]'>Administrator</p> */}
        <div className='flex justify-center items-center'>
          <span className='box-content flex absolute mx-auto font-medium text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 to-pink-500 border blur-xl select-none w-fit'>
            Administrator
          </span>
          <h1 className='flex relative top-0 justify-center items-center h-auto font-medium text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 to-pink-500 select-auto w-fit'>
            Administrator
          </h1>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
