import { PropsWithChildren, ReactNode } from 'react';

interface UserMetaItemProps extends PropsWithChildren {
  icon: ReactNode;
}

export default function UserMetaItem({ icon, children }: UserMetaItemProps) {
  return (
    <div className='flex items-center gap-x-4 text-muted-foreground font-semibold text-[16px]'>
      <span className='flex items-center justify-center w-5 h-5'>{icon}</span>
      {children}
    </div>
  );
}
