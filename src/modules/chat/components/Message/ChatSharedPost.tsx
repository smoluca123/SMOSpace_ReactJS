import SharedPostEmbed from '@/components/Posts/SharedPostEmbed';
import { useGetPost } from '@/modules/post-detail/components/PostDetail/querys';
import { Loader2 } from 'lucide-react';
import { UUID } from 'crypto';

/**
 * Renders a shared post inside a chat bubble. The message stores the post id in
 * its `content`; we fetch the post (react-query dedupes/caches) and embed it.
 */
export default function ChatSharedPost({ postId }: { postId: string }) {
  const { data: post, isLoading, isError } = useGetPost({ postId: postId as UUID });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center w-64 h-24 rounded-2xl bg-muted'>
        <Loader2 className='w-5 h-5 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className='px-4 py-3 w-64 text-sm rounded-2xl text-muted-foreground bg-muted'>
        This post is no longer available.
      </div>
    );
  }

  // If the shared post is itself a repost with no caption, embed the original.
  const embedded = !post.content && post.sharedPost ? post.sharedPost : post;

  return (
    <div className='w-64 sm:w-72'>
      <SharedPostEmbed post={embedded} />
    </div>
  );
}
