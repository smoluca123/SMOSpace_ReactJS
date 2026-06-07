import { PostList } from '@/components/Posts';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import { useGetMyBookmarks } from '../querys';
import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  const bookmarksQuery = useGetMyBookmarks();
  const { data, isPending } = bookmarksQuery;

  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const isEmpty = !isPending && totalCount === 0;

  return (
    <section className='px-2 w-full lg:max-w-md xl:max-w-xl'>
      <ContentWrapper className='mb-2'>
        <h1 className='flex gap-2 items-center text-2xl font-bold text-foreground'>
          <Bookmark className='size-6' />
          Saved posts
        </h1>
      </ContentWrapper>

      {isEmpty ? (
        <ContentWrapper>
          <p className='py-10 text-center text-muted-foreground'>
            You haven't saved any posts yet. Tap "Save" on a post to view it later.
          </p>
        </ContentWrapper>
      ) : (
        <PostList infinitePostData={bookmarksQuery} />
      )}
    </section>
  );
}
