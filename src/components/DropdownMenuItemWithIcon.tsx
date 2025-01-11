import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu';
import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, PropsWithChildren, RefAttributes } from 'react';

interface MenuItemProps extends PropsWithChildren, PropsWithClassName, DropdownMenuItemProps {
  Icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  variant?: 'default' | 'destructive';
}

const variants: Record<string, string> = {
  default: '',
  destructive: 'text-destructive',
};

const IconColor = {
  default: 'text-primary',
  destructive: 'text-destructive',
};

export default function DropdownMenuItemWithIcon({
  Icon,
  children,
  className,
  variant = 'default',
  ...props
}: MenuItemProps) {
  return (
    <DropdownMenuItem
      className={cn('flex items-center h-10 gap-x-4 cursor-pointer', className, {
        [variants[variant]]: variants[variant],
      })}
      {...props}
    >
      <Icon className={cn('!size-5', IconColor[variant])} />
      {children}
    </DropdownMenuItem>
  );
}
