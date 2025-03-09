import SubmitPostBox from '@/modules/home/components/SubmitPostBox';
import LeftSidebar from '@/modules/profile/components/Profile/ProfileContent/LeftSidebar';
import Posts from '@/modules/profile/components/Profile/ProfileContent/Posts';

export default function ProfileContent() {
  return (
    <div className='flex gap-4'>
      <LeftSidebar />

      {/* Right Side */}
      <div className='flex-1 space-y-4'>
        <SubmitPostBox />
        <Posts />
      </div>
    </div>
  );
}
