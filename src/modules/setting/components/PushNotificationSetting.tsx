import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  disablePush,
  enablePush,
  EnablePushError,
  isPushEnabled,
  isPushSupported,
} from '@/lib/push';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Toggle browser push notifications. Turning on registers the service worker,
 * requests permission and subscribes; turning off unsubscribes and remembers
 * the opt-out so we don't re-subscribe automatically.
 */
export default function PushNotificationSetting() {
  const { toast } = useToast();
  const supported = isPushSupported();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supported) return;
    isPushEnabled().then(setEnabled);
  }, [supported]);

  const handleToggle = async (checked: boolean) => {
    setLoading(true);
    try {
      if (checked) {
        await enablePush();
        setEnabled(true);
        toast({ description: 'Push notifications enabled', duration: 2500 });
      } else {
        await disablePush();
        setEnabled(false);
        toast({ description: 'Push notifications disabled', duration: 2500 });
      }
    } catch (err) {
      const reason = err as EnablePushError;
      const description =
        reason === 'denied'
          ? 'Permission blocked. Enable notifications for this site in your browser settings.'
          : reason === 'server-disabled'
            ? 'Push is not configured on the server.'
            : reason === 'unsupported'
              ? 'Your browser does not support push notifications.'
              : 'Could not update push notifications.';
      toast({ variant: 'destructive', description, duration: 3500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex gap-4 justify-between items-center'>
      <div className='flex gap-3 items-start'>
        <Bell className='mt-0.5 w-5 h-5 text-muted-foreground' />
        <div>
          <p className='font-medium'>Push notifications</p>
          <p className='text-sm text-muted-foreground'>
            {supported
              ? 'Get notified about new messages and activity even when the app is closed.'
              : 'Your browser does not support push notifications.'}
          </p>
        </div>
      </div>
      <Switch checked={enabled} disabled={!supported || loading} onCheckedChange={handleToggle} />
    </div>
  );
}
