import FollowButton from '@/components/FollowButton';
import { ProfileLinkWithCard } from '@/components/ProfileLink';
import UserAvatar from '@/components/UserAvatar';
import { IUserDataType } from '@/lib/types/interfaces';

interface IProps {
  user: IUserDataType;
}

export default function UserItem({ user }: IProps) {
  return (
    <ProfileLinkWithCard username={user.username} key={user.id} userId={user.id} className='w-full'>
      <div className='flex items-center justify-between p-2 transition-colors duration-300 rounded-md cursor-pointer hover:bg-accent'>
        <div className='flex items-center'>
          {/* User's avatar with margin spacing */}
          <UserAvatar className='mr-[10px]' avatarUrl={user.avatar} fallbackName={user.username} />
          <h1 className='font-semibold break-words truncate whitespace-pre-line transition-colors duration-300 text-muted-foreground hover:text-foreground line-clamp-1'>
            {user.fullName}
          </h1>
        </div>
        {/* User's name with text styling and truncation */}

        {/* Add friend button positioned at the end */}
        <FollowButton hiddenLabel userId={user.id} />
      </div>
    </ProfileLinkWithCard>
  );
}
