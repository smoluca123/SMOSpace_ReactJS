import { useProfileContext } from '@/hooks/useProfileContext';
import ContentWrapper from '@/modules/home/components/ContentWrapper';

export default function ProfileCoverImage() {
  const { userData } = useProfileContext();
  return (
    <ContentWrapper
      className='!p-0 min-h-60 max-h-80 bg-card'
      // style={{
      //   backgroundImage: `url("${userData.coverImage}")`,
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      //   backgroundRepeat: 'no-repeat',
      // }}
    >
      <img src={userData.coverImage} alt={userData.displayName} className='size-full' />
    </ContentWrapper>
  );
}
