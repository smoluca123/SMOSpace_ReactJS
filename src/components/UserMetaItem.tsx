import { PropsWithChildren, ReactNode } from 'react';

interface UserMetaItemProps extends PropsWithChildren {
  icon: ReactNode;
}

export default function UserMetaItem({ icon, children }: UserMetaItemProps) {
  return (
    <div className='flex items-center text-sm gap-x-4 text-secondary-foreground'>
      <span className='flex items-center justify-center w-5 h-5'>{icon}</span>
      <div className='flex-1'>{children}</div>
    </div>
  );
}
