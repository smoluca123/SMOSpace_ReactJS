import { Button } from '@/components/ui/button';

export default function CancelRequestButton() {
  return (
    <Button className=' w-full lg:max-w-[150px] hover:bg-muted-foreground/20 rounded-[8px] bg-muted-foreground/30 text-foreground '>
      Cancel
    </Button>
  );
}
