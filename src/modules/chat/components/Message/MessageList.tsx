'use client';

import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from '@/modules/chat/components/Message/';
import { InfiniteData } from '@tanstack/react-query';
import { IRoomMessageDataType } from '@/apis/types/chat.interfaces';
import { IApiPaginationResponseWrapper } from '@/lib/types/interfaces';

interface MessageListProps {
  messages: InfiniteData<IApiPaginationResponseWrapper<IRoomMessageDataType>['data']>;
  isGroup: boolean;
}

export default function MessageList({ messages, isGroup }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  console.log(messages);
  return (
    <>
      <ScrollArea className='overflow-auto flex-1 p-4 h-full'>
        <div className='space-y-4'>
          {messages.pages
            .flatMap((page) => page.items)
            .map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isGroup={isGroup}
                // onAddReaction={onAddReaction}
                // onShowReadReceipts={onShowReadReceipts}
              />
            ))}

          {/* Typing Indicators */}
          {/* {conversation.participants
            .filter((p) => p.isTyping)
            .map((participant) => (
              <div key={participant.id} className='flex items-start space-x-3'>
                <Avatar className='w-8 h-8'>
                  <AvatarImage src={participant.avatar || '/placeholder.svg'} />
                  <AvatarFallback>
                    {participant.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className='px-4 py-2 rounded-2xl bg-muted'>
                  <div className='flex items-center space-x-1'>
                    <span className='mr-2 text-xs text-muted-foreground'>{participant.name}</span>
                    <div className='flex space-x-1'>
                      <div className='w-2 h-2 rounded-full animate-bounce bg-muted-foreground' />
                      <div
                        className='w-2 h-2 rounded-full animate-bounce bg-muted-foreground'
                        style={{ animationDelay: '0.1s' }}
                      />
                      <div
                        className='w-2 h-2 rounded-full animate-bounce bg-muted-foreground'
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))} */}
        </div>
        <div id='messages-end' ref={messagesEndRef} />
      </ScrollArea>
    </>
  );
}
