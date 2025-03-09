import { Button } from '@/components/ui/button';
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
    </ContentWrapper>
  );
}
