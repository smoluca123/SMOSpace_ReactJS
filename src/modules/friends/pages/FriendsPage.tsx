import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import FriendsRequest from '../components/FriendRequests';
import FriendsList from '../components/FriendsList';

export default function FriendsPage() {
  return (
    <section className='px-2 w-full lg:max-w-md xl:max-w-full'>
      <Tabs defaultValue='requests' className='w-full'>
        <TabsList className='grid grid-cols-2 mb-2 w-full max-w-sm'>
          <TabsTrigger value='requests'>Friend requests</TabsTrigger>
          <TabsTrigger value='friends'>Friends</TabsTrigger>
        </TabsList>

        <TabsContent value='requests'>
          <FriendsRequest />
        </TabsContent>

        <TabsContent value='friends'>
          <ContentWrapper>
            <h1 className='mb-2 text-2xl font-bold text-foreground'>Friends</h1>
            <FriendsList />
          </ContentWrapper>
        </TabsContent>
      </Tabs>
    </section>
  );
}
