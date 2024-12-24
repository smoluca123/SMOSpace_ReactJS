import { Input } from '@/components/ui/input';
import { PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export default function SearchInput({ className }: PropsWithClassName) {
  return (
    <div className={cn('relative', className)}>
      <Input placeholder='Search for people, pages, groups and #hashtags' className='pe-10' />
      <Search className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
    </div>
  );
}
