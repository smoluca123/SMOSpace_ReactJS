import SearchHeader from './components/SearchHeader';
import SearchTabs from './components/SearchTabs';

export default function SearchPage() {
  return (
    <div className='flex-1 space-y-4 overflow-hidden'>
      <SearchHeader />
      <SearchTabs />
    </div>
  );
}
