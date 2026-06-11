import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useUpdateMyInfomationMutation } from '@/lib/mutations';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { Eye } from 'lucide-react';

/**
 * Toggle the "show online status" privacy preference. When off, other users
 * won't see this account as online (the account can still see others).
 */
export default function OnlineStatusSetting() {
  const { user } = useAppSelector(selectAuth);
  const { toast } = useToast();
  const { mutate, isPending } = useUpdateMyInfomationMutation();

  // Default to true when the field hasn't been set yet.
  const show = user?.showOnlineStatus !== false;

  const handleToggle = (checked: boolean) => {
    mutate(
      { showOnlineStatus: checked },
      {
        onSuccess: () =>
          toast({
            description: checked
              ? 'Your online status is now visible'
              : 'Your online status is now hidden',
            duration: 2500,
          }),
        onError: () => toast({ variant: 'destructive', description: 'Failed to update setting' }),
      },
    );
  };

  return (
    <div className='flex gap-4 justify-between items-center'>
      <div className='flex gap-3 items-start'>
        <Eye className='mt-0.5 w-5 h-5 text-muted-foreground' />
        <div>
          <p className='font-medium'>Show online status</p>
          <p className='text-sm text-muted-foreground'>
            Let friends and people you follow see when you're active.
          </p>
        </div>
      </div>
      <Switch checked={show} disabled={isPending} onCheckedChange={handleToggle} />
    </div>
  );
}
