import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import UserAdditionalInfo from '@/components/UserAdditionalInfo';
import UserMetaData from '@/components/UserMetaData';
import { useProfileContext } from '@/hooks/useProfileContext';
import ContentWrapper from '@/modules/home/components/ContentWrapper';
import parse from 'html-react-parser';

export default function ProfileInfo() {
  const { userData, isMe } = useProfileContext();
  return (
    <ContentWrapper className='space-y-2'>
      <h1 className='text-lg font-semibold'>About</h1>

      {/* Bio */}
      <div className='space-y-2 text-center'>
        {parse(userData.bio || '')}

        {/* Edit bio button */}
        {isMe && (
          <Button variant='secondary' className='w-full'>
            Edit bio
          </Button>
        )}
      </div>

      <Separator />

      {/*  */}
      <div className='space-y-4'>
        <UserMetaData user={userData} />

        <UserAdditionalInfo user={userData} />
      </div>
    </ContentWrapper>
  );
}
