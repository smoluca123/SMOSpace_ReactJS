import { cn } from '@/lib/utils';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';

export default function MenuItem({
  icon,
  title,
  action,
  isActive = null,
  disabled = false,
}: {
  icon?: string;
  title?: string;
  action?: () => void;
  isActive?: (() => boolean) | null;
  disabled?: boolean;
}) {
  if (disabled) return null;
  return (
    <button
      className={cn('bg-transparent border-none rounded-md text-white cursor-pointer size-9 p-2', {
        '!bg-primary !text-white': isActive && isActive(),
      })}
      onClick={action}
      title={title}
    >
      <svg className='fill-current size-full'>
        <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
      </svg>
    </button>
  );
}
