import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock } from 'lucide-react';

const TABS = [
  { value: 'all', label: 'All Posts', icon: null },
  { value: 'public', label: 'Published', icon: CheckCircle },
  { value: 'private', label: 'Private', icon: Clock },
] as const;

export default function PostsFilterAndTabs() {
  return (
    <TabsList className='grid w-full h-auto grid-cols-3 p-1 mb-6'>
      {TABS.map(({ value, label, icon: Icon }) => (
        <TabsTrigger key={value} value={value} className='py-2'>
          {Icon && <Icon className='w-4 h-4 mr-2' />}
          {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
