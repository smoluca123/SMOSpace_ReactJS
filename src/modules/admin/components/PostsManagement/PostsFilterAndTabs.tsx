import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Globe, Lock, Share2 } from 'lucide-react';

export default function PostsFilterAndTabs() {
  return (
    <TabsList className='grid w-full h-auto grid-cols-4 p-1 mb-6'>
      <TabsTrigger value='all' className='py-2'>
        <Globe className='w-4 h-4 mr-2' />
        All Posts
      </TabsTrigger>
      <TabsTrigger value='public' className='py-2'>
        <CheckCircle className='w-4 h-4 mr-2' />
        Public
      </TabsTrigger>
      <TabsTrigger value='private' className='py-2'>
        <Lock className='w-4 h-4 mr-2' />
        Private
      </TabsTrigger>
      <TabsTrigger value='shared' className='py-2'>
        <Share2 className='w-4 h-4 mr-2' />
        Shared
      </TabsTrigger>
    </TabsList>
  );
}
