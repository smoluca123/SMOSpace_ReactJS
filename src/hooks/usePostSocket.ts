import { postSocket } from '@/lib/sockets';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';

import { addNewPosts } from '@/redux/slices/postSlice';

export function usePostSocket() {
  const { user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Kết nối tới namespace posts
    postSocket.connect();

    // Lắng nghe sự kiện có bài viết mới
    postSocket.on('post:onNewPost', (newPost) => {
      if (newPost.author.id === user?.id) return;

      dispatch(addNewPosts(newPost));

      // Cập nhật cache của react-query
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

      // Hiển thị thông báo có bài viết mới (optional)
      toast({
        title: 'New post',
        description: `${newPost.author.fullName} just posted something new!`,
        duration: 3000,
      });
    });

    // Xử lý lỗi kết nối
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    postSocket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to real-time updates',
        variant: 'destructive',
      });
    });

    // Cleanup khi component unmount
    return () => {
      postSocket.off('post:onNewPost');
      postSocket.off('connect_error');
      postSocket.disconnect();
    };
  }, [user?.id, dispatch]);
}
