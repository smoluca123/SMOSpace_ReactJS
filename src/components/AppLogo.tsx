import NightLogo from '@/assets/imgs/night-logo.png';
import Logo from '@/assets/imgs/logo.png';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';
import { Link } from 'react-router-dom';

export default function AppLogo({
  className,
  wrapperClassName,
}: {
  className?: string;
  wrapperClassName?: string;
}) {
  const { theme } = useTheme();

  return (
    <Link to='/' className={cn('', wrapperClassName)}>
      <img
        src={theme === 'dark' ? NightLogo : Logo}
        alt='SMO Space Logo'
        className={cn('h-8 w-[200px]', className)}
      />
    </Link>
  );
}
