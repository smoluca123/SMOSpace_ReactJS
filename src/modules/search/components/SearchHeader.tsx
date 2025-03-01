import RefreshButton from '@/components/RefreshButton';
import ContentWrapper from '@/modules/home/components/ContentWrapper';

export default function SearchHeader() {
  return (
    <ContentWrapper className='flex items-center justify-between w-full gap-x-4'>
      <div>
        <h1 className='my-1 font-bold '>Search</h1>
        <p className='text-sm'>Search for people, pages, groups and #hashtags</p>
      </div>
      <RefreshButton />
    </ContentWrapper>
  );
}
