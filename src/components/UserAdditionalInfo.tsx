import type { IUserDataType } from '@/lib/types/interfaces';
import UserMetaItem from './UserMetaItem';
import { BriefcaseBusiness, Home, LinkIcon, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cleanURLForUI } from '@/lib/utils';

export default function UserAdditionalInfo({ user }: { user: IUserDataType }) {
  if (!user.additionalInfo) return null;

  const { hometown, jobs, living, websites } = user.additionalInfo;


  return (
    <>
      {/* Living */}
      {living && (
        <UserMetaItem icon={<Home size={20} />}>
          <span>Lives in</span> <span className='font-semibold'>{living}</span>
        </UserMetaItem>
      )}

      {/* Hometown */}
      {hometown && (
        <UserMetaItem icon={<MapPin size={20} />}>
          <span>From</span> <span className='font-semibold'>{hometown}</span>
        </UserMetaItem>
      )}

      {/* Jobs */}
      {jobs?.map((job, i) => (
        <UserMetaItem key={`job-${i}`} icon={<BriefcaseBusiness size={20} />}>
          {job}
        </UserMetaItem>
      ))}

      {/* Websites */}
      {websites?.map((url, i) => (
        <UserMetaItem key={`website-${i}`} icon={<LinkIcon size={20} />}>
          <Link target='_blank' className='text-primary hover:underline' to={url}>
          {cleanURLForUI(url)}
          </Link>
        </UserMetaItem>
      ))}
    </>
  );
}
