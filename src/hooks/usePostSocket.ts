import { postSocket } from '@/lib/sockets';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

import { addNewPosts } from '@/redux/slices/postSlice';

export function usePostSocket() {
  const { user, isAuthenticated } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Don't connect if not authenticated
    if (!isAuthenticated || !user?.id) {
      if (postSocket.connected) {
        postSocket.disconnect();
      }
      return;
    }

    // Force disconnect and reconnect to ensure fresh token is sent
    if (postSocket.connected) {
      postSocket.disconnect();
    }

    // Connect to the posts namespace
    postSocket.connect();

    // Listen for the new-post event
    postSocket.on('post:onNewPost', (newPost) => {
      if (newPost.author.id === user?.id) return;

      dispatch(addNewPosts(newPost));

      // Update the react-query cache
      // queryClient.setQueriesData(
      //   {
      //     queryKey: ['posts'],
      //   },
      //   (
      //     oldData: InfiniteData<
      //       IApiPaginationResponseWrapper<IPostDataWithLikedStatusType>['data']
      //     >,
      //   ) => {
      //     if (!oldData) return oldData;

      //     const firstPage = oldData.pages[0];
      //     const updatedFirstPage = {
      //       ...firstPage,
      //       items: [newPost, ...firstPage.items],
      //     };

      //     return {
      //       ...oldData,
      //       pages: [updatedFirstPage, ...oldData.pages.slice(1)],
      //     };
      //   },
      // );

      // Show a toast for the new post (optional)
      toast({
        title: 'New post',
        description: `${newPost.author.fullName} just posted something new!`,
        duration: 3000,
      });
    });

    // Handle connection errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    postSocket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to real-time updates',
        variant: 'destructive',
      });
    });

    // Cleanup on component unmount
    return () => {
      postSocket.off('post:onNewPost');
      postSocket.off('connect_error');
      // Keep connection alive
    };
  }, [isAuthenticated, user?.id, dispatch]);
}
