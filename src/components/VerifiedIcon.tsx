import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';

interface IProps extends PropsWithClassName {
  isVerified: boolean;
}

export default function VerifiedIcon({ className, isVerified }: IProps) {
  if (!isVerified) return null;
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <CircleCheck className={cn('w-4 h-4 text-primary', className)} />
      </TooltipTrigger>
      <TooltipContent>
        <p className='text-foreground'>Verified</p>
      </TooltipContent>
    </Tooltip>
  );
}
