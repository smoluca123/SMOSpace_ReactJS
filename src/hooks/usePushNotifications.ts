import { enablePush, getPushPreference, isPushSupported } from '@/lib/push';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useEffect, useRef } from 'react';

/**
 * Auto-subscribes the browser to Web Push once the user is authenticated, so
 * they receive notifications even when the tab/app is closed. Respects the
 * user's explicit opt-out (Settings toggle) and is a safe no-op when the
 * browser doesn't support push or permission isn't granted.
 */
export default function usePushNotifications() {
  const { user } = useAppSelector(selectAuth);
  const userId = user?.id;
  const triedRef = useRef(false);

  useEffect(() => {
    if (!userId || triedRef.current || !isPushSupported()) return;

    // Honour an explicit opt-out, and don't prompt users who haven't already
    // granted permission (avoid an unsolicited prompt on every login).
    if (getPushPreference() === false) return;
    if (Notification.permission !== 'granted') return;

    triedRef.current = true;
    enablePush().catch((err) => {
      console.warn('Push notification setup skipped:', err);
    });
  }, [userId]);
}
