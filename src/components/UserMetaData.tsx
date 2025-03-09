import { Repeat2, Rss, UserRoundPlus } from 'lucide-react';
import UserMetaItem from './UserMetaItem';
import { IUserDataType } from '@/lib/types/interfaces';

export default function UserMetaData({ user }: { user: IUserDataType }) {
  return (
    <>
      <UserMetaItem icon={<Rss size={20} />}>{user.followerCount} followers</UserMetaItem>
      <UserMetaItem icon={<UserRoundPlus size={20} />}>
        Following {user.followingCount} people
      </UserMetaItem>
      <UserMetaItem icon={<Repeat2 size={20} />}>{user.postCount} posts</UserMetaItem>
    </>
  );
}
