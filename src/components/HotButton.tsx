import { Badge } from '@/components/ui/badge';
import { Button, ButtonProps } from '@/components/ui/button';
import { PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

interface IProps extends PropsWithClassName, PropsWithChildren, ButtonProps {}

export default function HotButton({ className, children, ...props }: IProps) {
  return (
    <div className='relative w-fit'>
      <Button className={cn('', className)} {...props}>
        {children}
      </Button>
      <Badge className='absolute w-8 h-5 p-0 -top-2 -right-4 bg-secondary hover:bg-secondary'>
        <span className='text-center w-full text-primary text-[10px]'>HOT</span>
      </Badge>
    </div>
  );
}
