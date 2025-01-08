import LikedUsersList from '@/components/Posts/PostEngagementMetrics/LikedUsersDialog/LikedUsersList';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PropsWithChildren, useState } from 'react';

export default function LikedUsersDialog({ children }: PropsWithChildren) {
  const [isOpenValue, setIsOpenValue] = useState(false);

  return (
    <Dialog onOpenChange={(isOpen) => setIsOpenValue(isOpen)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className=''>
        <DialogHeader>
          <DialogTitle>Liked Users</DialogTitle>
          <DialogDescription>Users who liked this post</DialogDescription>
        </DialogHeader>
        <div className='max-h-[80vh] overflow-y-auto'>
          <LikedUsersList enableFetch={isOpenValue} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
