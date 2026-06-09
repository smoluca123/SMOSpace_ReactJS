import DropdownMenuItemWithIcon from '@/components/DropdownMenuItemWithIcon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePostContext } from '@/hooks/usePostContext';
import { Repeat2, Send, Share2 } from 'lucide-react';
import { useState } from 'react';
import SharePostDialog from './SharePostDialog';
import SharePostToChatDialog from './SharePostToChatDialog';

export default function SharePost() {
  const { post } = usePostContext();
  const [repostOpen, setRepostOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='flex gap-2 items-center'>
            <Share2 className='size-4' />
            Share
            {(post.shareCount ?? 0) > 0 && (
              <span className='text-muted-foreground'>{post.shareCount}</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-48'>
          <DropdownMenuItemWithIcon
            Icon={Repeat2}
            className='h-10'
            onClick={() => setRepostOpen(true)}
          >
            Repost to profile
          </DropdownMenuItemWithIcon>
          <DropdownMenuItemWithIcon Icon={Send} className='h-10' onClick={() => setSendOpen(true)}>
            Send in message
          </DropdownMenuItemWithIcon>
        </DropdownMenuContent>
      </DropdownMenu>

      <SharePostDialog open={repostOpen} onClose={() => setRepostOpen(false)} />
      <SharePostToChatDialog open={sendOpen} onClose={() => setSendOpen(false)} />
    </>
  );
}
