import { cn } from '@/lib/utils';
import { PropsWithClassName } from '@/lib/types/interfaces';
import { Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import useCommentContext from '@/hooks/useCommentContext';
import DeleteCommentButton from '@/components/Posts/Comment/CommentActions/DeleteComment/DeleteCommentButton';
import EditCommentButton from '@/components/Posts/Comment/CommentActions/EditComment/EditCommentButton';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IProps extends PropsWithClassName {}

export default function CommentMoreButton({ className }: IProps) {
  const { comment } = useCommentContext();
  const { user } = useAppSelector(selectAuth);

  const isOwner = user?.id === comment.author.id;

  if (!isOwner) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className={cn('size-6', className)} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40'>
        <EditCommentButton />
        <DeleteCommentButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
