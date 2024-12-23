'use client';

import CreatePostDialog from '@/components/Posts/Editor/CreatePostDialog';
import UserAvatar from '@/components/UserAvatar';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SubmitPostBox() {
  const [open, setOpen] = useState(false);
  const { user } = useAppSelector(selectAuth);

  return (
    <>
      <ContentWrapper className='flex gap-x-4 items-center'>
        {user && (
          <>
            <UserAvatar fallbackName={user.fullName} avatarUrl={user.avatar} />
            <div
              className='grid place-items-center w-full h-9 rounded-lg border cursor-text bg-background hover:bg-background/70 border-border'
              onClick={() => setOpen(true)}
            >
              <span className='text-sm text-muted-foreground'>Write your post...</span>
            </div>
          </>
        )}
        {!user && (
          <Link className='block w-full' to='/auth/login'>
            <div className='grid place-items-center w-full h-9 rounded-lg border cursor-pointer bg-background hover:bg-background/70 border-border'>
              <span className='text-sm text-muted-foreground'>Sign in to submit a post</span>
            </div>
          </Link>
        )}
      </ContentWrapper>
      <CreatePostDialog isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
