import { IUserDataType } from '@/lib/types/interfaces';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import UserAvatar from '@/components/UserAvatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users } from 'lucide-react';
import { useGetAllUsersInfomation } from '@/lib/querys';
import { Badge } from '@/components/ui/badge';
import { formatDate } from 'date-fns';
import { cn } from '@/lib/utils';

export default function RecentUsers() {
  const getUserBagVariant = (user: IUserDataType) => (user.isActive ? 'default' : 'secondary');

  const { data, isLoading, fetchNextPage, hasNextPage } = useGetAllUsersInfomation({
    keywords: '',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2'>
          <Users className='w-5 h-5' />
          <span>Recent Users</span>
        </CardTitle>
        <CardDescription>Latest user registrations and activity</CardDescription>
      </CardHeader>
      <CardContent>
        <InfiniteScrollContainer
          onBottomReached={fetchNextPage}
          isShowInViewElement={hasNextPage}
          className='space-y-4'
        >
          {data?.pages.map((page) =>
            page.items.map((user) => (
              <div
                key={user.id}
                className='flex items-center p-3 space-x-4 transition-colors rounded-lg hover:bg-accent'
              >
                <UserAvatar avatarUrl={user.avatar} />
                <div className='flex-1 space-y-1'>
                  <p
                    className={cn('text-sm font-medium text-foreground', {
                      'text-destructive line-through': user.isBanned,
                    })}
                  >
                    {user.fullName}
                  </p>
                  <div
                    className={cn('text-muted-foreground', {
                      'text-destructive line-through': user.isBanned,
                    })}
                  >
                    <p>{user.email}</p>
                    <p>{user.followerCount} followers</p>
                  </div>
                </div>
                <div className='space-y-1 text-right'>
                  <Badge variant={getUserBagVariant(user)}>
                    {user.isBanned ? 'Banned' : user.isActive ? 'Activer' : 'InActive'}
                  </Badge>
                  <p className='text-xs text-muted-foreground'>
                    {formatDate(new Date(user.createdAt), 'dd-MM-yyyy')}
                  </p>
                </div>
              </div>
            )),
          )}

          {isLoading && <Loader2 className='mx-auto text-primary animate-spin' />}
        </InfiniteScrollContainer>
      </CardContent>
    </Card>
  );
}
