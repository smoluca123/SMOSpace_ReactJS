import DeleteFriendDialog from '@/components/FriendButtons/DeleteFriendButton/DeleteFriendDialog';
import { Button, ButtonProps } from '@/components/ui/button';
import { IUserDataType, PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { PropsWithChildren, useState } from 'react';

interface IProps extends PropsWithClassName, PropsWithChildren, ButtonProps {
  userData: IUserDataType;
}

export default function DeleteFriendButton({ userData, className, children, ...props }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        variant='outline-destructive'
        onClick={() => setIsOpen(true)}
        className={cn('w-full', className)}
        {...props}
      >
        {children || 'Unfriend'}
      </Button>
      <DeleteFriendDialog userData={userData} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
