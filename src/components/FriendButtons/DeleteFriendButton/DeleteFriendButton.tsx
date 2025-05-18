import DeleteFriendDialog from '@/components/FriendButtons/DeleteFriendButton/DeleteFriendDialog';
import { Button } from '@/components/ui/button';
import { IUserDataType, PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { PropsWithChildren, useState } from 'react';

interface IProps extends PropsWithClassName, PropsWithChildren {
  userData: IUserDataType;
}

export default function DeleteFriendButton({ userData, className, children }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        variant='outline-destructive'
        onClick={() => setIsOpen(true)}
        className={cn('w-full', className)}
      >
        {children || 'Unfriend'}
      </Button>
      <DeleteFriendDialog userData={userData} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
