import { Input } from '@/components/ui/input';
import { PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SearchInput({ className }: PropsWithClassName) {
  const [searchParams] = useSearchParams();
  const keywords = searchParams.get('q');
  const [searchQuery, setSearchQuery] = useState(keywords || '');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };
  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder='Search for people, pages, groups and #hashtags'
          className='pe-10'
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
        <button type='submit' className='absolute -translate-y-1/2 right-3 top-1/2'>
          <Search className='text-muted-foreground' />
        </button>
      </form>
    </div>
  );
}
