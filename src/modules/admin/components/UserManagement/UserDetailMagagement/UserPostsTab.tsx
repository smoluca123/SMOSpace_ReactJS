import { useGetPosts } from '@/components/Posts/querys';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TabsContent } from '@/components/ui/tabs';
import useUserContext from '@/hooks/useUserContext';
import { formatDate } from 'date-fns';
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import parser from 'html-react-parser';
import UserAvatar from '@/components/UserAvatar';
import { useNavigate } from 'react-router-dom';
import DeletePostDialog from '../../AdminActions/PostActions/DeletePostDialog';
import { useState } from 'react';
import { IPostDataType } from '@/lib/types/interfaces';

export default function UserPostsTab() {
  const { userData } = useUserContext();

  const { data } = useGetPosts({
    userId: userData.id,
  });

  const navigate = useNavigate();

  const [selectedPostToDelete, setSelectedPostToDelete] = useState<IPostDataType | null>(null);

  return (
    <>
      <TabsContent value='posts' className='mt-6 space-y-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>User Posts</CardTitle>
            <CardDescription>All posts created by this user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {data?.pages.map((page) =>
                page.items.map((post) => (
                  <div>
                    <div
                      key={post.id}
                      className='flex items-center justify-between p-4 border rounded-lg'
                    >
                      <div className='flex-1'>
                        <div className='flex items-center gap-x-2'>
                          <UserAvatar className='size-6' avatarUrl={post.author.avatar} />
                          <h1>{post.author.fullName}</h1>
                        </div>
                        <div className='w-1/2 mt-1 text-sm text-muted-foreground line-clamp-2'>
                          {parser(post.content)}
                        </div>
                        <div className='flex items-center mt-2 space-x-4 text-xs text-muted-foreground'>
                          <span>{post.likeCount} likes</span>
                          <span>{post.commentCount} comments</span>
                          <span>{formatDate(new Date(post.createdAt), 'dd-MM-yyyy')}</span>
                        </div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Badge variant={!post.isPrivate ? 'default' : 'secondary'}>
                          {post.isPrivate ? 'Private' : 'Public'}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreHorizontal className='w-4 h-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => navigate('/post/' + post.id)}>
                              <Eye className='w-4 h-4 mr-2' />
                              View Post
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setSelectedPostToDelete(post)}
                              className='text-destructive'
                            >
                              <Trash2 className='w-4 h-4 mr-2' />
                              Delete Post
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                )),
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      {selectedPostToDelete && (
        <DeletePostDialog
          post={selectedPostToDelete}
          open={!!selectedPostToDelete}
          onClose={() => setSelectedPostToDelete(null)}
        />
      )}
    </>
  );
}
