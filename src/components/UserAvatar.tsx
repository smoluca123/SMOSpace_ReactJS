import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import avatarPlaceholder from '@/assets/imgs/avatar-placeholder.png';

interface IProps extends PropsWithClassName {
  fallbackName?: string;
  avatarUrl?: string;
}

export default function UserAvatar({ avatarUrl, fallbackName = 'Anonymous', className }: IProps) {
  return (
    <Avatar className={cn('size-10', className)}>
      <AvatarFallback>{fallbackName[0].toLocaleUpperCase()}</AvatarFallback>
      <AvatarImage
        className='object-cover'
        src={avatarUrl || avatarPlaceholder}
        alt={fallbackName}
      />
    </Avatar>
  );
}
