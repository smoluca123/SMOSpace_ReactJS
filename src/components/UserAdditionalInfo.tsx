import { IUserDataType } from '@/lib/types/interfaces';
import UserMetaItem from './UserMetaItem';
import { BriefcaseBusiness, MapPin } from 'lucide-react';

export default function UserAdditionalInfo({ user }: { user: IUserDataType }) {
  if (!user.additionalInfo) return null;

  return (
    <>
      {/* Living */}
      {user.additionalInfo?.living && (
        <UserMetaItem icon={<MapPin size={20} />}>
          Live at {user.additionalInfo.living}
        </UserMetaItem>
      )}

      {/* Jobs */}
      {user.additionalInfo?.jobs.map((job, i) => (
        <UserMetaItem icon={<BriefcaseBusiness />} key={i}>
          {job}
        </UserMetaItem>
      ))}
    </>
  );
}
