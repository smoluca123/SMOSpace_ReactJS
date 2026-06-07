import { IUserPresenceUpdate, userSocket } from '@/lib/sockets';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { resetPresence, setOnlineUsers, setUserPresence } from '@/redux/slices/presenceSlice';
import { useEffect } from 'react';

/**
 * Connects to the `user` socket namespace, announces the current user as online
 * and keeps the presence slice in sync with realtime presence updates.
 *
 * Mount once near the app root (it is a singleton socket, so mounting it more
 * than once just re-registers the same listeners).
 */
export default function useUserPresence() {
  const { user, isAuthenticated } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // No point tracking presence for an anonymous visitor.
    if (!isAuthenticated || !user?.id) {
      return;
    }

    // Force a fresh handshake so the current user's token is (re)sent. Without
    // this, a lingering connection from a previous session could keep using a
    // stale token after re-login.
    if (userSocket.connected) {
      userSocket.disconnect();
    }
    userSocket.connect();

    const handleConnect = () => {
      // Announce self online and ask for the current snapshot.
      userSocket.emit('user:online', { status: 'online' });
      userSocket.emit('user:getOnline');
    };

    const handleOnlineList = (list: IUserPresenceUpdate[]) => {
      dispatch(setOnlineUsers(list));
    };

    const handlePresenceUpdate = (update: IUserPresenceUpdate) => {
      dispatch(setUserPresence(update));
    };

    userSocket.on('connect', handleConnect);
    userSocket.on('user:online:list', handleOnlineList);
    userSocket.on('user:presence:update', handlePresenceUpdate);

    // Socket may already be connected (e.g. fast remounts) — sync immediately.
    if (userSocket.connected) {
      handleConnect();
    }

    return () => {
      userSocket.off('connect', handleConnect);
      userSocket.off('user:online:list', handleOnlineList);
      userSocket.off('user:presence:update', handlePresenceUpdate);
      userSocket.disconnect();
      dispatch(resetPresence());
    };
  }, [dispatch, isAuthenticated, user?.id]);
}
