import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Activity, Calendar, Edit, FileText, Mail, MapPin, Phone } from 'lucide-react';
import UserStatusBadge from '../../UserStatusBadge';
import UserRoleBadge from '../../UserRoleBadge';
// import useUserContext from '@/hooks/useUserContext';
import { formatDate } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import useUserContext from '@/hooks/useUserContext';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import parser from 'html-react-parser';

export default function UserOverviewTab() {
  const { userData } = useUserContext<IUserDataWithFollowedStatusType>();

  return (
    <TabsContent value='overview' className='mt-6 space-y-6'>
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center text-lg'>
              <Mail className='w-5 h-5 mr-2' />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <Mail className='w-4 h-4 text-muted-foreground' />
                <span className='text-sm'>{userData.email}</span>
              </div>
              <Button variant='ghost' size='sm'>
                <Edit className='w-3 h-3' />
              </Button>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <Phone className='w-4 h-4 text-muted-foreground' />
                <span className='text-sm'>{userData.phoneNumber}</span>
              </div>
              <Button variant='ghost' size='sm'>
                <Edit className='w-3 h-3' />
              </Button>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <MapPin className='w-4 h-4 text-muted-foreground' />
                <span className='text-sm'>{userData.additionalInfo?.living}</span>
              </div>
              <Button variant='ghost' size='sm'>
                <Edit className='w-3 h-3' />
              </Button>
            </div>
            <div className='flex items-center space-x-3'>
              <Calendar className='w-4 h-4 text-muted-foreground' />
              <span className='text-sm'>
                Joined {formatDate(new Date(userData.createdAt), 'dd-MM-yyyy')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center text-lg'>
              <Activity className='w-5 h-5 mr-2' />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Status</span>
              <div className='flex items-center space-x-2'>
                <UserStatusBadge user={userData} />
                <Button variant='ghost' size='sm'>
                  <Edit className='w-3 h-3' />
                </Button>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Role</span>
              <div className='flex items-center space-x-2'>
                <UserRoleBadge role={userData.userType.typeName} />
                <Button variant='ghost' size='sm'>
                  <Edit className='w-3 h-3' />
                </Button>
              </div>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Last Active</span>
              <span className='text-sm'>
                {formatDate(new Date(userData.updatedAt), 'dd-MM-yyyy')}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Verified</span>
              <div className='flex items-center space-x-2'>
                <Badge variant={userData.isVerified ? 'default' : 'secondary'}>
                  {userData.isVerified ? 'Yes' : 'No'}
                </Badge>
                <Button variant='ghost' size='sm'>
                  <Edit className='w-3 h-3' />
                </Button>
              </div>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Account Age</span>
              <span className='text-sm'>
                {Math.floor(
                  (new Date().getTime() - new Date(userData.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{' '}
                days
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between text-lg'>
            <div className='flex items-center'>
              <FileText className='w-5 h-5 mr-2' />
              Bio
            </div>

            <Button variant='ghost' size='sm'>
              <Edit className='w-4 h-4' />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-sm text-muted-foreground'>{parser(userData.bio || '')}</div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
