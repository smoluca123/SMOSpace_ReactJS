import { MouseEvent, PropsWithChildren, useEffect, useState } from 'react';
import { Button, ButtonProps } from './ui/button';
import { Loader2 } from 'lucide-react';

interface IProps extends PropsWithChildren, Omit<ButtonProps, 'type'> {
  reCountWhenClicked?: boolean;
  countdownTime: number;
  isCountFirstTime?: boolean;
  loading?: boolean;
}

export default function CountdownButton({
  children,
  onClick,
  reCountWhenClicked,
  countdownTime,
  isCountFirstTime,
  loading,
  ...props
}: IProps) {
  const [countdown, setCountdown] = useState<number>(isCountFirstTime ? countdownTime : 0);
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Before click
    if (!onClick) return;

    // Process click
    onClick(e);

    // After click
    if (reCountWhenClicked) {
      setCountdown(countdownTime);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prew) => {
        return prew > 0 ? prew - 1 : prew;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <Button disabled={!!countdown || loading} type='button' onClick={handleClick} {...props}>
      {loading ? (
        <>
          <Loader2 className=' animate-spin' />
          Loading...
        </>
      ) : countdown ? (
        countdown + 's'
      ) : (
        children
      )}
    </Button>
  );
}
