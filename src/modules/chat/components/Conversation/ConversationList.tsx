'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus } from 'lucide-react';
import ConversationItem from '@/modules/chat/components/Conversation/ConversationItem';
import { useGetActiveChatRoomsQuery } from '@/modules/chat/components/Conversation/querys';
import ConversationSkeletons from '@/modules/chat/components/Conversation/ConversationSkeletons';

interface ConversationListProps {
  onCreateGroup: () => void;
  sidebarOpen: boolean;
}

export default function ConversationList({ onCreateGroup, sidebarOpen }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: activeRooms, isFetching } = useGetActiveChatRoomsQuery();

  return (
    <>
      <div
        className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r bg-card flex flex-col overflow-hidden lg:w-80 lg:block`}
      >
        {/* Sidebar Header */}
        <div className='p-4 border-b'>
          <div className='flex justify-between items-center mb-4'>
            <h1 className='text-xl font-semibold'>Messages</h1>
            <Button variant='ghost' size='icon' onClick={onCreateGroup}>
              <Plus className='w-5 h-5' />
            </Button>
          </div>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search conversations...'
              className='pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className='block flex-1 w-full'>
          <div className='p-2 w-80'>
            {activeRooms && (
              <>
                {activeRooms.pages
                  .flatMap((page) => page.items)
                  .map((conversation) => (
                    <ConversationItem key={conversation.id} conversation={conversation} />
                  ))}
              </>
            )}
            {isFetching && <ConversationSkeletons />}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
