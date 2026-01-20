import { ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RefreshCcw } from 'lucide-react';

interface IProps extends ButtonProps {
  isLoading?: boolean;
  label?: string;
  hiddenLabel?: boolean;
}

export default function RefreshButton({ isLoading, label, hiddenLabel, ...props }: IProps) {
  return (
    <button
      className='flex items-center p-2 text-sm transition-colors duration-300 border rounded-sm gap-x-2 hover:bg-foreground/5 border-border text-primary'
      {...props}
      disabled={isLoading || props.disabled}
    >
      <RefreshCcw
        className={cn('w-4 h-4', {
          'animate-spin': isLoading,
        })}
      />
      <span className={cn({ hidden: hiddenLabel })}>{label || 'Refresh'}</span>
    </button>
  );
}
