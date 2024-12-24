import UserAvatar from '@/components/UserAvatar';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { Dot } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserCard() {
  const { user } = useAppSelector(selectAuth);
  if (!user) return null;
  return (
    <ContentWrapper className='space-y-4 text-center'>
      <UserAvatar
        fallbackName={user.fullName}
        avatarUrl={user.avatar}
        className='mx-auto size-32'
      />
      <div className=''>
        <Link to='/' className='text-xl font-semibold hover:underline'>
          {user.fullName}
        </Link>
        <p className='text-muted-foreground'>@{user.username}</p>
      </div>
      <div className='flex gap-x-1 justify-center items-center text-sm text-muted-foreground'>
        <p>39 Followers</p>
        <Dot />
        <p>0 Posts</p>
        <Dot />
        <p>1 Following</p>
      </div>
      <div className='flex'>
        <UserAvatar
          fallbackName={user.fullName}
          avatarUrl={user.avatar}
          className='mx-auto size-8'
        />
        <UserAvatar
          fallbackName={user.fullName}
          avatarUrl={user.avatar}
          className='mx-auto size-8'
        />
        <UserAvatar
          fallbackName={user.fullName}
          avatarUrl={user.avatar}
          className='mx-auto size-8'
        />
        <UserAvatar
          fallbackName={user.fullName}
          avatarUrl={user.avatar}
          className='mx-auto size-8'
        />
        <UserAvatar
          fallbackName={user.fullName}
          avatarUrl={user.avatar}
          className='mx-auto size-8'
        />
        <UserAvatar
          fallbackName={user.fullName}
          avatarUrl={user.avatar}
          className='mx-auto size-8'
        />
      </div>
    </ContentWrapper>
  );
}
