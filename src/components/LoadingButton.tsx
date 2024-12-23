import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ILoadingButtonProps extends ButtonProps {
  loading: boolean;
}

export default function LoadingButton({
  loading,
  disabled,
  children,
  className,
  ...props
}: ILoadingButtonProps) {
  return (
    <Button
      disabled={loading || disabled}
      className={cn('flex gap-2 items-center', className)}
      {...props}
    >
      {loading && <Loader2 className="animate-spin size-5" />}
      {children}
    </Button>
  );
}
