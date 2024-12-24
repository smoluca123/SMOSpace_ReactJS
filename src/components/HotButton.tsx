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
      <Badge className='absolute -top-2 -right-4 p-0 w-8 h-5 bg-secondary hover:bg-secondary/70'>
        <span className='text-center w-full text-primary text-[10px]'>HOT</span>
      </Badge>
    </div>
  );
}
