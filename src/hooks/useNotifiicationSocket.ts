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
  const { user, isAuthenticated } = useAppSelector(selectAuth);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Don't connect if not authenticated
    if (!isAuthenticated || !user?.id) {
      if (notificationSocket.connected && isAuthenticated === false) {
        notificationSocket.disconnect();
      }
      return;
    }

    // Only connect if not already connected
    if (!notificationSocket.connected) {
      notificationSocket.connect();
    }

    const handleHasNewNotification = (newNotification: INotificationType) => {
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

      // Friendship notifications (request received / request accepted) should
      // refresh the friend request list, friend lists, profile (button states)
      // and friend counts in realtime.
      if (newNotification.entityType === 'FRIENDSHIP') {
        queryClient.invalidateQueries({ queryKey: ['friend-request', 'me'] });
        queryClient.invalidateQueries({ queryKey: ['friend-list'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }

      // Show toast notification (optional)
      toast({
        title: 'New notification',
        description: newNotification.content.message,
        duration: 3000,
      });
    };

    const handleConnect = () => {
      notificationSocket.emit('noti:subscribe');
    };

    notificationSocket.on('connect', handleConnect);
    notificationSocket.on('noti:new', handleHasNewNotification);

    // If socket is already connected, emit subscribe immediately
    if (notificationSocket.connected) {
      handleConnect();
    }

    return () => {
      notificationSocket.off('noti:new', handleHasNewNotification);
      notificationSocket.off('connect', handleConnect);
      // Keep connection alive across re-renders
    };
  }, [isAuthenticated, user?.id, onNewNotification, queryClient]);
}
