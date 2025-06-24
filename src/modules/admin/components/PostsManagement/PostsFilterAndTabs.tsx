import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock } from 'lucide-react';

export default function PostsFilterAndTabs() {
  return (
    <TabsList className='grid h-auto grid-cols-3 p-1 mb-6 md:grid-cols-6'>
      <TabsTrigger value='all' className='py-2'>
        All Posts
      </TabsTrigger>
      <TabsTrigger value='public' className='py-2'>
        <CheckCircle className='w-4 h-4 mr-2' />
        Published
      </TabsTrigger>
      <TabsTrigger value='private' className='py-2'>
        <Clock className='w-4 h-4 mr-2' />
        Privated
      </TabsTrigger>
    </TabsList>
  );
}
