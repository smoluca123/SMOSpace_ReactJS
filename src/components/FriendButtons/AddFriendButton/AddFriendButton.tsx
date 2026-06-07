'use no memo';
import { UUID } from 'crypto';
import FriendButton from '@/components/FriendButton';
import { IUserDataTypeWithFriendStatus } from '@/lib/types/interfaces';

interface IProps {
  userId: UUID;
  userData?: IUserDataTypeWithFriendStatus;
  className?: string;
  asMenuItem?: boolean;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * AddFriendButton - thin wrapper around the reusable {@link FriendButton}.
 *
 * Kept for backwards compatibility with existing call-sites (e.g. ProfileCard).
 * All friendship logic/state now lives in FriendButton so behaviour stays
 * consistent everywhere it is used.
 */
export default function AddFriendButton({
  userId,
  userData,
  className,
  asMenuItem = false,
  variant = 'secondary',
  size = 'default',
}: IProps) {
  return (
    <FriendButton
      userId={userId}
      userData={userData}
      className={className}
      asMenuItem={asMenuItem}
      variant={variant}
      size={size}
    />
  );
}
