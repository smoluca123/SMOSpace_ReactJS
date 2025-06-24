import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, Edit, MoreHorizontal, CheckCircle, Ban, Trash2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import UserAvatar from '@/components/UserAvatar';
import UserStatusBadge from '../components/UserStatusBadge';
import UserRoleBadge from '../components/UserRoleBadge';
import { useGetUserInfomation } from '@/lib/querys';
import VerifiedIcon from '@/components/VerifiedIcon';
import UserProvider from '../components/UserManagement/UserDetailMagagement/UserProvider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserOverviewTab from '../components/UserManagement/UserDetailMagagement/UserOverviewTab';
import useUserContext from '@/hooks/useUserContext';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import UserPostsTab from '../components/UserManagement/UserDetailMagagement/UserPostsTab';

export default function UserDetailPage() {
  const { username } = useParams();

  const { data: userData } = useGetUserInfomation({
    userId: username || '',
  });

  return (
    userData && (
      <UserProvider userData={userData}>
        <div className='space-y-6'>
          <UserDetailHeader />

          {/* User Stats */}
          <div className='grid gap-4 md:grid-cols-4'>
            <Card>
              <CardContent className='pt-6'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-foreground'>{userData.postCount}</div>
                  <div className='text-sm text-muted-foreground'>Posts</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='pt-6'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-foreground'>{userData.followerCount}</div>
                  <div className='text-sm text-muted-foreground'>Followers</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='pt-6'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-foreground'>
                    {userData.followingCount}
                  </div>
                  <div className='text-sm text-muted-foreground'>Following</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='pt-6'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-foreground'>{userData.friendCount}</div>
                  <div className='text-sm text-muted-foreground'>Friends</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue='overview' className='w-full'>
            <TabsList className='grid w-full grid-cols-6'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='posts'>Posts</TabsTrigger>
            </TabsList>
            <UserOverviewTab />
            <UserPostsTab />
          </Tabs>
        </div>
      </UserProvider>
    )
  );
}

const UserDetailHeader = () => {
  const { userData } = useUserContext<IUserDataWithFollowedStatusType>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Link to='/admin/users'>
            <Button variant='outline' size='icon'>
              <ArrowLeft className='w-4 h-4' />
            </Button>
          </Link>
          <div className='flex items-center space-x-5'>
            <UserAvatar className='size-[50px]' avatarUrl={userData.avatar} />
            <div className='space-y-2'>
              <h1 className='flex items-center space-x-2 text-2xl font-bold text-foreground'>
                <span>{userData.fullName}</span>
                {userData.isVerified && <VerifiedIcon isVerified />}
              </h1>
              <div className='flex items-center mt-1 space-x-2'>
                <UserStatusBadge user={userData} />
                <UserRoleBadge role={userData.userType.typeName} />
              </div>
            </div>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <Button variant='outline' onClick={() => setIsEditDialogOpen(true)}>
            <Edit className='w-4 h-4 mr-2' />
            Edit User
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline'>
                <MoreHorizontal className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <CheckCircle className='w-4 h-4 mr-2' />
                Verify User
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Ban className='w-4 h-4 mr-2' />
                Suspend User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-destructive'>
                <Trash2 className='w-4 h-4 mr-2' />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid items-center grid-cols-4 gap-4'>
              <Label htmlFor='edit-name' className='text-right'>
                Name
              </Label>
              <Input
                id='edit-name'
                name='name'
                defaultValue={userData.fullName}
                className='col-span-3'
              />
            </div>
            <div className='grid items-center grid-cols-4 gap-4'>
              <Label htmlFor='edit-email' className='text-right'>
                Email
              </Label>
              <Input
                id='edit-email'
                name='email'
                type='email'
                defaultValue={userData.email}
                className='col-span-3'
              />
            </div>
            <div className='grid items-center grid-cols-4 gap-4'>
              <Label htmlFor='edit-role' className='text-right'>
                Role
              </Label>
              <Select name='role' defaultValue={userData.userType.typeName}>
                <SelectTrigger className='col-span-3'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='User'>User</SelectItem>
                  <SelectItem value='Moderator'>Moderator</SelectItem>
                  <SelectItem value='Admin'>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid items-center grid-cols-4 gap-4'>
              <Label htmlFor='edit-status' className='text-right'>
                Status
              </Label>
              <Select name='status' defaultValue={'abcd'}>
                <SelectTrigger className='col-span-3'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Active'>Active</SelectItem>
                  <SelectItem value='Inactive'>Inactive</SelectItem>
                  <SelectItem value='Banned'>Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
