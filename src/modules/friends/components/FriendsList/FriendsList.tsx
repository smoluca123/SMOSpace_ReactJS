import { ChevronLeft, Loader2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetMyFriendsQuery } from '@/modules/profile/components/Profile/ProfileContent/FriendList/querys';
import ProfileLink from '@/components/ProfileLink';
import UserAvatar from '@/components/UserAvatar';
import NameWithBadge from '@/components/NameWithBadge';
import NameWithVerifiedIcon from '@/components/NameWithVerifiedIcon';
import { DeleteFriendButton } from '@/components/FriendButtons';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { IUserDataType } from '@/lib/types/interfaces';

export default function FriendsList() {
  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetMyFriendsQuery();

  const friends = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  if (isPending) return <ListLoader />;

  if (totalCount === 0) return <EmptyFriends />;

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'>
        {friends.map((friend) => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </div>

      {hasNextPage && (
        <div className='flex justify-center'>
          <Button variant='outline' onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? <Loader2 className='animate-spin' /> : 'Show more'}
          </Button>
        </div>
      )}
    </div>
  );
}

function FriendCard({ friend }: { friend: IUserDataType }) {
  return (
    <div className='flex overflow-hidden flex-col w-full max-h-96 rounded-md border border-border'>
      {/* Avatar */}
      <div className='overflow-hidden relative flex-1 w-full bg-black'>
        <UserAvatar
          userId={friend.id}
          className='object-contain rounded-none size-full'
          avatarUrl={friend.avatar}
          fallbackName={friend.fullName}
        />
      </div>

      {/* Content */}
      <div className='p-4 space-y-3'>
        <div className='truncate whitespace-pre-line break-words line-clamp-1'>
          <ProfileLink username={friend.username} className='font-bold text-foreground'>
            <NameWithBadge userData={friend}>
              <NameWithVerifiedIcon isVerified={friend.isVerified}>
                {friend.fullName}
              </NameWithVerifiedIcon>
            </NameWithBadge>
          </ProfileLink>
        </div>

        <div className='space-y-2'>
          <ProfileLink username={friend.username} className='block w-full'>
            <Button className='w-full text-white' variant='outline-primary'>
              <User className='w-4 h-4' />
              Profile
            </Button>
          </ProfileLink>
          <DeleteFriendButton userData={friend}>
            <Trash className='w-4 h-4' />
            Unfriend
          </DeleteFriendButton>
        </div>
      </div>
    </div>
  );
}

const ListLoader = () => (
  <div className='my-4 w-full'>
    <Loader2 className='mx-auto animate-spin text-primary' />
  </div>
);

const EmptyFriends = () => (
  <div className=''>
    <div className='text-center'>
      <h1 className='my-5 text-base text-muted-foreground'>You don't have any friends yet!</h1>
    </div>
    <Link className='flex ml-3 gap-x-2 text-primary' to={'/'}>
      <ChevronLeft />
      Back to home
    </Link>
  </div>
);
