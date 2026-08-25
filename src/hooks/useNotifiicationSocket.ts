import { toast } from '@/hooks/use-toast';
import { notificationSocket } from '@/lib/sockets';
import {
  IApiPaginationResponseWrapper,
  INotificationType,
  IUserWithAccessTokenType,
} from '@/lib/types/interfaces';
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

    // Refresh token in auth payload before connecting
    const currentUser = JSON.parse(
      localStorage.getItem('currentUser') || 'null',
    ) as IUserWithAccessTokenType | null;
    const token = currentUser?.accessToken || '';

    notificationSocket.auth = {
      accessToken: token,
      token,
    };

    // Only connect if not already connected
    if (!notificationSocket.connected) {
      notificationSocket.connect();
    }

    const handleHasNewNotification = (newNotification: INotificationType) => {
      if (onNewNotification) {
        onNewNotification(newNotification);
      }

      // Update flat notifications cache immediately for instant UI response
      queryClient.setQueriesData(
        {
          queryKey: ['notifications'],
        },
        (oldData: InfiniteData<IApiPaginationResponseWrapper<INotificationType>['data']> | undefined) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;

          const firstPage = oldData.pages[0];
          // Prevent duplicates if already present
          const alreadyExists = firstPage.items.some((item) => item.id === newNotification.id);
          if (alreadyExists) return oldData;

          const updatedFirstPage = {
            ...firstPage,
            items: [newNotification, ...firstPage.items],
            totalCount: (firstPage.totalCount || 0) + 1,
          };

          return {
            ...oldData,
            pages: [updatedFirstPage, ...oldData.pages.slice(1)],
          };
        },
      );

      // Force refetch grouped notifications so the grouped view is instantly updated
      queryClient.invalidateQueries({ queryKey: ['grouped-notifications'] });
      queryClient.refetchQueries({ queryKey: ['grouped-notifications'] });

      // Entity-specific invalidations
      if (newNotification.entityType === 'FRIENDSHIP') {
        queryClient.invalidateQueries({ queryKey: ['friend-request', 'me'] });
        queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
        queryClient.invalidateQueries({ queryKey: ['friend-list'] });
        queryClient.invalidateQueries({ queryKey: ['friends'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      } else if (newNotification.entityType === 'COMMENT') {
        queryClient.invalidateQueries({ queryKey: ['comments'] });
      } else if (newNotification.entityType === 'POST') {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      }

      // Show toast notification
      toast({
        title: newNotification.content?.title || 'New notification',
        description: newNotification.content?.message || 'You received a new notification',
        duration: 4000,
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
    };
  }, [isAuthenticated, user?.id, onNewNotification, queryClient]);
}
