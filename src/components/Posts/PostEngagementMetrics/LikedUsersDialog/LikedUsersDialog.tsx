import LikedUsersList from '@/components/Posts/PostEngagementMetrics/LikedUsersDialog/LikedUsersList';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePostContext } from '@/hooks/usePostContext';
import { cn } from '@/lib/utils';
import { getTopReactions, IReactionType, REACTIONS } from '@/lib/reactions';
import { PropsWithChildren, useMemo, useState } from 'react';

const ALL_TAB = 'ALL';

export default function LikedUsersDialog({ children }: PropsWithChildren) {
  const { post } = usePostContext();
  const [isOpenValue, setIsOpenValue] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(ALL_TAB);

  // Only show tabs for reactions that actually exist on this post (Facebook
  // style). `getTopReactions` with a high limit just sorts present reactions
  // by count descending.
  const presentReactions = useMemo(
    () => getTopReactions(post.reactionCounts, REACTIONS.length),
    [post.reactionCounts],
  );

  const totalCount = post.likeCount;

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        setIsOpenValue(isOpen);
        if (!isOpen) setActiveTab(ALL_TAB);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Reactions</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='flex overflow-x-auto justify-start w-full h-auto'>
            <TabsTrigger value={ALL_TAB} className='gap-1'>
              All
              <span className='text-muted-foreground'>{totalCount}</span>
            </TabsTrigger>
            {presentReactions.map((reaction) => (
              <TabsTrigger key={reaction.type} value={reaction.type} className='gap-1'>
                <span className='text-base leading-none'>{reaction.emoji}</span>
                <span className={cn('text-muted-foreground')}>
                  {post.reactionCounts?.[reaction.type] ?? 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Render only the active tab's list so we don't fetch every tab at
              once; each tab keeps its own cache via the query key. */}
          <TabsContent value={ALL_TAB} className='max-h-[60vh] overflow-y-auto'>
            {activeTab === ALL_TAB && <LikedUsersList enableFetch={isOpenValue} />}
          </TabsContent>
          {presentReactions.map((reaction) => (
            <TabsContent
              key={reaction.type}
              value={reaction.type}
              className='max-h-[60vh] overflow-y-auto'
            >
              {activeTab === reaction.type && (
                <LikedUsersList enableFetch={isOpenValue} type={reaction.type as IReactionType} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
