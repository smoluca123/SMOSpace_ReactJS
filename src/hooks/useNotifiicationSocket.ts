import { toast } from '@/hooks/use-toast';
import { notificationSocket } from '@/lib/sockets';
import { IApiPaginationResponseWrapper, INotificationType } from '@/lib/types/interfaces';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface UseNotificationSocketProps {
  onNewNotification?: (notification: INotificationType) => void;
}

export default function useNotificationSocket(props?: UseNotificationSocketProps) {
  const { onNewNotification } = props || {};
  const { user } = useAppSelector(selectAuth);
  const queryClient = useQueryClient();

  useEffect(() => {
    notificationSocket.connect();

    const handleConnect = () => {
      notificationSocket.emit('noti:subscribe');
      notificationSocket.on('noti:new', handleHasNewNotification);
    };

    const handleHasNewNotification = (newNotification: INotificationType) => {
      console.log('newNotification', newNotification);
      if (onNewNotification) {
        onNewNotification(newNotification);
      }

      // Cancel pending queries
      queryClient.cancelQueries({ queryKey: ['notifications'] });
      queryClient.cancelQueries({ queryKey: ['grouped-notifications'] });

      // Update flat notifications cache
      queryClient.setQueriesData(
        {
          queryKey: ['notifications'],
        },
        (oldData: InfiniteData<IApiPaginationResponseWrapper<INotificationType>['data']>) => {
          if (!oldData) return oldData;

          const firstPage = oldData.pages[0];
          const updatedFirstPage = {
            ...firstPage,
            items: [newNotification, ...firstPage.items],
          };

          return {
            ...oldData,
            pages: [updatedFirstPage, ...oldData.pages.slice(1)],
          };
        },
      );

      // Invalidate grouped notifications to refetch with new grouping
      queryClient.invalidateQueries({ queryKey: ['grouped-notifications'] });

      // Show toast notification (optional)
      toast({
        title: 'New notification',
        description: newNotification.content.message,
        duration: 3000,
      });
    };

    notificationSocket.on('connect', handleConnect);

    // If socket is already connected, emit subscribe immediately
    if (notificationSocket.connected) {
      handleConnect();
    }

    return () => {
      notificationSocket.off('noti:new');
      notificationSocket.off('connect');
      notificationSocket.disconnect();
    };
  }, [user?.id, onNewNotification, queryClient]);
}
