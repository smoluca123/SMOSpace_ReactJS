import { Badge, BadgeProps } from '@/components/ui/badge';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';

export default function UserStatusBadge({ user }: { user: IUserDataWithFollowedStatusType }) {
  const variant: BadgeProps['variant'] = user.isActive ? 'default' : 'secondary';

  return <Badge variant={variant}>{user.isActive ? 'Active' : 'Inactive'}</Badge>;
}
