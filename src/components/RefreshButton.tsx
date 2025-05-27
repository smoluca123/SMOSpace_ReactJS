import { ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RefreshCcw } from 'lucide-react';

interface IProps extends ButtonProps {
  isLoading?: boolean;
}

export default function RefreshButton({ isLoading, ...props }: IProps) {
  return (
    <button
      className='flex gap-x-2 items-center p-2 text-sm rounded-sm border transition-colors duration-300 hover:bg-foreground/5 border-border text-primary'
      {...props}
      disabled={isLoading || props.disabled}
    >
      <RefreshCcw
        className={cn('w-4 h-4', {
          'animate-spin': isLoading,
        })}
      />
      Refresh
    </button>
  );
}
