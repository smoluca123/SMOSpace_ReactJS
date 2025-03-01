import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Repeat2, User } from 'lucide-react';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import SearchContent from './SearchContent';
import { SearchUserContent } from './SearchUser';
import { PropsWithChildren } from 'react';
import { PropsWithClassName } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';

export default function Component() {
  return (
    <Tabs defaultValue='search-post' className='items-center'>
      <ContentWrapper>
        <TabsList className='justify-start w-full gap-5 bg-transparent'>
          <SearchTabTrigger value='search-post'>
            <Repeat2 />
            Posts
          </SearchTabTrigger>
          <SearchTabTrigger value='search-user'>
            <User />
            People
          </SearchTabTrigger>
        </TabsList>
      </ContentWrapper>

      <TabsContent className='pt-4' value='search-post'>
        <SearchContent />
      </TabsContent>
      <TabsContent className='pt-4' value='search-user'>
        <SearchUserContent />
      </TabsContent>
    </Tabs>
  );
}

interface ISearchTabTriggerProps extends PropsWithChildren, PropsWithClassName {
  value: string;
}

function SearchTabTrigger({ value, children, className }: ISearchTabTriggerProps) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        'data-[state=active]:bg-primary data-[state=active]:text-white rounded-full bg-secondary data-[state=active]:shadow-none gap-2',
        className,
      )}
    >
      {children}
    </TabsTrigger>
  );
}
