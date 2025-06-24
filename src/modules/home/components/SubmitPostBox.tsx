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
      <ContentWrapper className='flex items-center gap-x-4'>
        {user && (
          <>
            <UserAvatar fallbackName={user.fullName} avatarUrl={user.avatar} />
            <div
              className='grid w-full border rounded-lg place-items-center h-9 cursor-text bg-background hover:bg-background/70 border-border'
              onClick={() => setOpen(true)}
            >
              <span className='text-sm text-muted-foreground'>Write your post...</span>
            </div>
          </>
        )}
        {!user && (
          <Link className='block w-full' to='/auth/login'>
            <div className='grid w-full border rounded-lg cursor-pointer place-items-center h-9 bg-background hover:bg-background/70 border-border'>
              <span className='text-sm text-muted-foreground'>Sign in to submit a post</span>
            </div>
          </Link>
        )}
      </ContentWrapper>
      <CreatePostDialog isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
